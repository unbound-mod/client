import { Theme, Clipboard } from '@api/metro/common';
import { PureComponent, type useRef } from 'react';
import type { Manager } from '@typings/managers';
import { useSettingsStore } from '@api/storage';
import { Discord } from '@api/metro/components';
import { showDialog } from '@api/dialogs';
import { SocialLinks } from '@constants';
import Toasts, { showToast } from '@api/toasts';
import * as managers from '@managers';
import { View } from 'react-native';
import { Strings } from '@api/i18n';
import { Icons } from '@api/assets';
import * as Managers from "@managers";
import {createTimeoutSignal} from "@utilities";
import { compareSemanticVersions, getHighestVersion} from "@utilities/compareSemanticVersions";


interface InstallModalProps {
	type: Manager;
	ref: ReturnType<typeof useRef<InstanceType<typeof InternalInstallInput>>>;
}

type InternalInstallModalProps = InstallModalProps & {
	settings: ReturnType<typeof useSettingsStore>;
};

export class InternalInstallInput extends PureComponent<InternalInstallModalProps> {
	controller = new AbortController();
	state = { url: '', loadingPaste: false, loadingInstall: false, message: null, error: null };

	get manager() {
		return managers[this.props.type];
	}

	render() {
		return <>
			{this.renderInput()}
			{this.renderButtons()}
		</>;
	}

	renderInput() {
		const { message, error } = this.state;
		const { settings } = this.props;

		return <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
			<View style={{ flex: 1, flexGrow: 1 }}>
				<Discord.TextInput
					isRound
					isClearable
					size={'md'}
					onChange={url => this.setState({ url })}
					onClear={() => this.setState({ error: null, message: null })}
					value={this.state.url}
					placeholder={`https://${this.manager.type}.com/manifest.json`}
					placeholderTextColor={Theme.unsafe_rawColors.PRIMARY_400}
					errorMessage={error}
					description={message}
				/>
			</View>

			<Discord.IconButton
				icon={Icons['ClipboardListIcon']}
				style={{ marginLeft: 8 }}
				variant={'tertiary'}
				size={'md'}
				loading={this.state.loadingPaste}
				onPress={() => {
					if (settings.get('onboarding.install', false)) {
						this.setState({ url: SocialLinks.OnboardingPlugin });
						return;
					}

					this.setState({ loadingPaste: true });

					Clipboard.getString().then(url => {
						this.setState({ url, loadingPaste: false });
					});
				}}
			/>
		</View>;
	}

	renderButtons() {
		const { url } = this.state;
		const { settings } = this.props;

		return <>
			<Discord.Button
				text={Strings.UNBOUND_INSTALL}
				style={{ marginTop: 18 }}
				loading={this.state.loadingInstall}
				onPress={() => {
					if (url) {
						this.setState({ loadingInstall: true });

						(this.manager).install(url, (state) => this.setState(state), this.controller.signal)
							.then(() => {
								this.setState({ loadingInstall: false });

								if (settings.get('onboarding.install', false)) {
									settings.set('onboarding.install', false);
								}
							});
					}
				}}
			/>
			<Discord.Button
				text={Strings.UNBOUND_CANCEL}
				style={{ marginTop: 12 }}
				onPress={() => {
					Discord.dismissAlerts();

					if (this.state.loadingInstall) {
						this.controller.abort();

						showToast({
							title: this.manager.name,
							content: Strings.UNBOUND_INSTALL_CANCELLED.format({ type: capitalize(this.manager.type) }),
							icon: 'CloseLargeIcon'
						});
					}
				}}
				variant={'secondary'}
			/>
		</>;
	}

	getInput() {
		return this.state.url;
	}
}

function InstallInput(props: InstallModalProps) {
	const settings = useSettingsStore('unbound');

	return <InternalInstallInput settings={settings} {...props} />;
}

export function showInstallAlert({ type, ref }: InstallModalProps) {
	const manager = managers[type];

	// This uses a custom button to prevent closing the dialog after failure
	// This is also to use a custom loading state for the async install method
	showDialog({
		title: Strings.UNBOUND_INSTALL_TITLE.format({ type: manager.type }),
		content: Strings.UNBOUND_ADDON_VALID_MANIFEST.format({ type: manager.type }),
		component: (
			<InstallInput
				type={type}
				ref={ref}
			/>
		),
		componentMargin: false,
		cancelButton: false
	});
}

export async function checkForUpdates() {
	Toasts.showToast({
		title: `Checking for Updates`,
		duration: 2000
	});
	//Themes are doing weird stuff and sometimes come up multiple times
	const existingAssets = []
	for (const theme of window.UNBOUND_THEMES ?? []) {
		const {manifest, bundle} = theme;

		if (!(manifest.id in existingAssets)) {

			if (manifest.hasOwnProperty("updates")) {
				const origin = manifest.url.split('/');
				origin.pop();
				const updatesURL = new URL(manifest.updates, origin.join('/') + '/');

				const updateRequest = await fetch(updatesURL, {
					cache: 'no-cache',
					signal: createTimeoutSignal()
				}).catch((error) => {
					this.logger.error('Failed to fetch bundle URL:', error.message);
					this.emit('install-error', error);

				});

				if (!updateRequest) return false;

				if (!updateRequest.ok) {
					//logger doesnt wanna work :/
					console.error(`Failed to fetch bundle URL (${updateRequest.status}: ${updateRequest.statusText ?? 'No status text.'})`);
					continue;
				}

				const updates = await updateRequest.json();
				const highestVer = getHighestVersion(updates);
				const latestVersionObject = updates.find(v => v.version === highestVer); //Maybe use for later for Patchnotes

				if (compareSemanticVersions(highestVer, manifest.version) > 0) {
					showDialog({
						title: manifest.name,
						content: `The Theme "${manifest.name}" has an Update: \n${manifest.version}->${highestVer}\nWould you like to update?`,
						buttons: [
							{
								text: "Update now",
								onPress: () => installUpdates(manifest.url, manifest.name)
							},

						]
					});
				} else if (compareSemanticVersions(highestVer, manifest.version) == 0) {
					//Check if TS is newer
				}


			}

		}


	}

}

function installUpdates(updates, name) {
	Managers.Themes.install(updates).then(r => Toasts.showToast({
		title: `Updated ${name}`,
		duration: 2000
	}));
}

export default { InstallInput, InternalInstallInput };