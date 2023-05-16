import { ReactNative } from '@metro/common';

const { DCDDeviceManager, BundleUpdaterManager } = ReactNative.NativeModules;

export const BundleInfo = ReactNative.NativeModules.InfoDictionaryManager ?? ReactNative.NativeModules.RTNClientInfoManager;
export const BundleManager = BundleUpdaterManager;
export const DeviceInfo = DCDDeviceManager;

// ReactNative.Linking.addListener('url', (event) => {
//   console.log(event);
// });