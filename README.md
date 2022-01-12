# WallpaperUpscaler

Fully working on windows & nvidia GPU (cuDNN), untested on other OS

## Requirements

1. [nodejs](https://nodejs.org/en/)
2. [git](https://git-scm.com/downloads)
3. [waifu2x-caffee](https://github.com/lltcggie/waifu2x-caffe/releases)
4. [nomacs](https://nomacs.org/download/)

> if you have scoop windows package manager installed, paste this in powershell

`scoop bucket add extras ; scoop install nodejs nomacs waifu2x-caffe`

## How to build & run

```bash
git clone https://github.com/ozakione/WallpaperUpscaler
cd WallpaperUpscaler/
npm i
node index.js
```
