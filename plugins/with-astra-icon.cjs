const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const { mkdir, writeFile } = require('node:fs/promises');
const { join } = require('node:path');
const star = '<path android:pathData="M30,54 L78,54 M54,30 L54,78 M37,37 L71,71 M37,71 L71,37" android:strokeColor="#3B82F6" android:strokeWidth="3" android:strokeLineCap="square" />';
module.exports = function withAstraIcon(config) {
  config = withAndroidManifest(config, mod => {
    const app = mod.modResults.manifest.application[0];
    app.$['android:icon'] = '@mipmap/astra_launcher';
    app.$['android:roundIcon'] = '@mipmap/astra_launcher';
    return mod;
  });
  return withDangerousMod(config, ['android', async mod => {
    const res = join(mod.modRequest.platformProjectRoot, 'app/src/main/res');
    const files = {
      'mipmap-anydpi/astra_launcher.xml': '<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108"><path android:pathData="M0,0 L108,0 L108,108 L0,108 Z" android:fillColor="#05070B"/>' + star + '</vector>',
      'drawable/astra_foreground.xml': '<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">' + star + '</vector>',
      'mipmap-anydpi-v26/astra_launcher.xml': '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/astra_icon_background"/><foreground android:drawable="@drawable/astra_foreground"/></adaptive-icon>',
      'values/astra_icon.xml': '<resources><color name="astra_icon_background">#05070B</color></resources>',
    };
    for (const [name, content] of Object.entries(files)) {
      const path = join(res, name);
      await mkdir(join(path, '..'), { recursive: true });
      await writeFile(path, content + '\n');
    }
    return mod;
  }]);
};
