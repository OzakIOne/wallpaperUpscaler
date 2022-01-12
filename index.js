import { PowerShell } from 'node-powershell';
import { execa } from 'execa';
import pkg from 'inquirer';
const { prompt } = pkg;

const validNumber = (val, min, max) => {
  const isValid = Number.isInteger(parseFloat(val));
  if (isValid && val >= min && val <= max) return true;
  return `Please enter a valid number between ${min} and ${min} (inclusive)`;
};

const powershellInstance = async () => {
  const ps = new PowerShell();

  try {
    const psCmd = PowerShell.command`(Get-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop').TranscodedImageCount`;
    const psOutput = await ps.invoke(psCmd);
    const totalWallpapers = parseInt(psOutput.raw, 10);
    const wpPathArray = [];

    const questions = [
      {
        type: 'input',
        name: 'wallpaper_choice',
        message: 'Choose wallpaper',
        validate: (value) => validNumber(value, 0, totalWallpapers),
      },
      {
        type: 'input',
        name: 'noise_level_choice',
        message: 'Choose noise level',
        validate: (value) => validNumber(value, 0, 3),
      },
      {
        type: 'input',
        name: 'scale_ratio_choice',
        message: 'Choose scale level',
        validate: (value) => validNumber(value, 1, 4),
      },
    ];

    for (let index = 0; index < totalWallpapers; index++) {
      const cmd = PowerShell.command`$reg${index}=(New-Object -ComObject WScript.Shell).RegRead("HKEY_CURRENT_USER\\Control Panel\\Desktop\\TranscodedImageCache_00${index}") ; ([System.Text.Encoding]::Unicode.GetString($reg${index}[24..($reg${index}.length-1)]) -split "\0")[0]`;
      const wpPath = await ps.invoke(cmd);
      wpPathArray.push(wpPath.raw);
    }
    wpPathArray.forEach((wp, index) => {
      console.log(`Wallpaper [${index}] - ${wp}`);
      execa('nomacs.exe', [wp]);
    });

    prompt(questions).then(
      ({ noise_level_choice, wallpaper_choice, scale_ratio_choice }) => {
        nomacsPs.kill('SIGINT');
        execa('waifu2x-caffe-cui.exe', [
          '--gpu',
          '0',
          '--batch_size',
          '1',
          '--output_quality',
          '95',
          '--process',
          'cudnn',
          '--scale_ratio',
          scale_ratio_choice,
          '--mode',
          'noise_scale',
          '--output_extention',
          'jpg',
          '--noise_level',
          noise_level_choice,
          '--input_path',
          wpPathArray[wallpaper_choice],
        ]);
      },
    );
  } catch (error) {
    console.error(error);
  } finally {
    await ps.dispose();
  }
};

(async () => {
  await powershellInstance();
})();
