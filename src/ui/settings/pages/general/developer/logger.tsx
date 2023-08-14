import { ReactNative as RN, React, StyleSheet, Constants, Moment, Theme, i18n } from '@metro/common';
import { Redesign, Navigation } from '@metro/components';
import { Icons } from '@api/assets';
import Logger from '@stores/logger';
import { TableRowGroupWrapper } from '@ui/components';

const LevelSelection = {
    variant(level: number) {
        return ['muted', 'normal', 'warning', 'danger'][level]
    },

    icon(level: number) {
        return ['ic_settings', 'ic_chat_bubble_16px', 'ic_warning_24px', 'failure-header'][level]
    }
}

export default function () {
	const navigation = Navigation.useNavigation();
	const store = Logger.useStore();

    const unsubscribe = navigation.addListener('focus', () => {
        unsubscribe();
        navigation.setOptions({ headerRight: HeaderRight });
    });

	return <TableRowGroupWrapper style={{ flex: 1, marginBottom: 16 }}>
		<RN.FlatList
			data={store.logs.sort((a, b) => a.time - b.time)}
			keyExtractor={(_, idx) => String(idx)}
			ListEmptyComponent={<RN.View style={styles.empty}>
				<RN.Image
					style={styles.emptyImage}
					source={Icons['img_connection_empty_dark']}
				/>
				<RN.Text style={styles.emptyMessage}>
					{i18n.Messages.UNBOUND_LOGS_EMPTY}
				</RN.Text>
			</RN.View>}
			renderItem={({ item }) => {
				return <Redesign.TableRow
					label={item.message}
					subLabel={Moment(item.time).format('HH:mm:ss.SSS')}
                    variant={LevelSelection.variant(item.level)}
                    icon={<Redesign.TableRowIcon source={Icons[LevelSelection.icon(item.level)]} />}
				/>;
			}}
		/>
	</TableRowGroupWrapper>;
}

const styles = StyleSheet.createThemedStyleSheet({
	touchable: {
		marginRight: 10
	},
	image: {
		tintColor: Theme.colors.TEXT_NORMAL
	},
	empty: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '50%'
	},
	emptyImage: {
		marginBottom: 10
	},
	emptyMessage: {
		color: Theme.colors.TEXT_MUTED,
		fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
		textAlign: 'center',
		paddingHorizontal: 25
	}
});

function HeaderRight() {
	return <RN.TouchableOpacity
		style={styles.touchable}
		onPress={() => Logger.store.setState({ logs: [] })}
	>
		<RN.Image
			style={styles.image}
			source={Icons['ic_input_clear_24px']}
		/>
	</RN.TouchableOpacity>;
}