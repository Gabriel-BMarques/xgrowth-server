/*
Author: Ashanfx
Date: 2020-09-05
Description: Input video will compress convert and store folder structure
Note:
Folder will be create by 'folderName' variable in 'outputPath'
Output file name will be base concat with generated with and height ie. basename+'-256x144'+videoformat
*/

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

const ffmpeg = require('fluent-ffmpeg');
const azureStorage = require('azure-storage');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
const fs = require('fs');
// Output location
const outputPath = `${__dirname}/outputs/`;
const blobService = azureStorage.createBlobService();


function baseName() {
  const base = '';
  return base;
}

function removeResizedFile(filePath) {
  fs.unlink(filePath, () => {});
}

function uploadVideos(containerName, fileFolder, convertedVideos, index) {
  let blobName;
  if (containerName === 'cblx-img') {
    blobName = `${fileFolder}/f${convertedVideos[index]}`;
  } else if (containerName === 'app-images') {
    blobName = `${fileFolder}${convertedVideos[index]}`;
  }
  const fileName = `${convertedVideos[index]}`;
  const filePath = `${__dirname}/outputs/${fileFolder}/${fileName}`;
  blobService.createBlockBlobFromLocalFile(containerName, blobName, filePath, (err) => {
    if (err) {
    } else if (index < convertedVideos.length) {
      // eslint-disable-next-line no-param-reassign
      index += 1;
      removeResizedFile(filePath);
      uploadVideos(containerName, fileFolder, convertedVideos, index);
    } else {
      fs.unlink(`${__dirname}/outputs/${fileFolder}`, () => {
      });
    }
  });
}

function uploadResizedVideos(filesPath, container) {
  const convertedVideos = fs.readdirSync(filesPath);
  convertedVideos.splice(convertedVideos.indexOf('thumbnail'), 1);
  const fileFolder = filesPath.split(`${__dirname}/outputs/`).pop();
  const index = 0;
  uploadVideos(container, fileFolder, convertedVideos, index);
}

exports.takeThumbnail = (file, takeAfterSeconds, path, container, blobName, res) => {
  const fileName = file.split(`${__dirname}/inputs/`).pop().split('.')[0];
  const thumbnailFileName = `${fileName}-thumbnail.png`;
  const thumbnailPath = `${__dirname}/outputs/${fileName}/thumbnail/`;
  // eslint-disable-next-line new-cap
  new ffmpeg(file)
    .screenshots({
      count: 1,
      timemarks: [takeAfterSeconds], // number of seconds
      folder: thumbnailPath,
      filename: thumbnailFileName,
    })
    .on('error', (err) => {
      console.log(`ERROR: ${err}`);
    })
    .on('end', () => {
      blobService.createBlockBlobFromLocalFile(container, thumbnailFileName, `${thumbnailPath}/${thumbnailFileName}`, (error) => {
        if (error) {
          console.log(error);
        } else {
          fs.unlink(`${thumbnailPath}/${thumbnailFileName}`, () => {
          });
          res.json({ blob: blobName, type: 'thumbnail' });
        }
      });
    });
}

/* Compressing functions */
async function compressFrom1080(file, basename, storePath, container) {
  return ffmpeg(file)
    // Generate 144P video
    .output(`${storePath}/${basename}-256x144.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('256x?')
    .format('mp4')
    // Generate 240P video
    .output(`${storePath}/${basename}-426x240.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('426x?')
    .format('mp4')
    // Generate 360P video
    .output(`${storePath}/${basename}-640x360.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('640x?')
    .format('mp4')
    // Generate 480P video
    .output(`${storePath}/${basename}-854x480.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('854x?')
    .format('mp4')
    // Generate 720P video
    .output(`${storePath}/${basename}-1280x720.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('1280x?')
    .format('mp4')
    // Generate 1080P video
    .output(`${storePath}/${basename}-1920x1080.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('1920x?')
    .format('mp4')
    .on('error', (err) => {
      console.log(`An error occurred: ${err.message}`);
      return false;
    })
    .on('end', () => {
      if (fs.existsSync(file)) {
        fs.unlink(file, () => {
        });
      }
      uploadResizedVideos(storePath, container);
      return true;
    })
    .run();
}
async function compressFrom720(file, basename, storePath, container) {
  return ffmpeg(file)
    // Generate 144P video
    .output(`${storePath}/${basename}-256x144.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('256x144')
    .format('mp4')
    // Generate 240P video
    .output(`${storePath}/${basename}-426x240.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('426x240')
    .format('mp4')
    // Generate 360P video
    .output(`${storePath}/${basename}-640x360.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('640x360')
    .format('mp4')
    // Generate 480P video
    .output(`${storePath}/${basename}-854x480.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('854x480')
    .format('mp4')
    // Generate 720P video
    .output(`${storePath}/${basename}-1280x720.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('1280x720')
    .format('mp4')
    .on('error', (err) => {
      console.log(`An error occurred: ${err.message}`);
      return false;
    })
    .on('end', () => {
      uploadResizedVideos(storePath, container);
      fs.unlink(file, () => {
      });
      return true;
    })
    .run();
}
async function compressFrom480(file, basename, storePath, container) {
  return ffmpeg(file)
    // Generate 144P video
    .output(`${storePath}/${basename}-256x144.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('256x144')
    .format('mp4')
    // Generate 240P video
    .output(`${storePath}/${basename}-426x240.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('426x240')
    .format('mp4')
    // Generate 360P video
    .output(`${storePath}/${basename}-640x360.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('640x360')
    .format('mp4')
    // Generate 480P video
    .output(`${storePath}/${basename}-854x480.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('854x480')
    .format('mp4')
    .on('error', (err) => {
      console.log(`An error occurred: ${err.message}`);
      return false;
    })
    .on('end', () => {
      uploadResizedVideos(storePath, container);
      fs.unlink(file, () => {
      });
      return true;
    })
    .run();
}
async function compressFrom360(file, basename, storePath, container) {
  return ffmpeg(file)
    // Generate 144P video
    .output(`${storePath}/${basename}-256x144.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('256x144')
    .format('mp4')
    // Generate 240P video
    .output(`${storePath}/${basename}-426x240.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('426x240')
    .format('mp4')
    // Generate 360P video
    .output(`${storePath}/${basename}-640x360.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('640x360')
    .format('mp4')
    .on('error', (err) => {
      console.log(`An error occurred: ${err.message}`);
      return false;
    })
    .on('end', () => {
      uploadResizedVideos(storePath, container);
      fs.unlink(file, () => {
      });
      return true;
    })
    .run();
}
async function compressFrom240(file, basename, storePath, container) {
  return ffmpeg(file)
    // Generate 144P video
    .output(`${storePath}/${basename}-256x144.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('256x144')
    .format('mp4')
    // Generate 240P video
    .output(`${storePath}/${basename}-426x240.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('426x240')
    .format('mp4')
    .on('error', (err) => {
      console.log(`An error occurred: ${err.message}`);
      return false;
    })
    .on('end', () => {
      uploadResizedVideos(storePath, container);
      fs.unlink(file, () => {
      });
      return true;
    })
    .run();
}
async function compressFrom144(file, basename, storePath, container) {
  return ffmpeg(file)
    // Generate 144P video
    .output(`${storePath}/${basename}-256x144.mp4`)
    .outputOptions('-movflags faststart')
    .videoCodec('libx264')
    .size('256x144')
    .format('mp4')
    .on('error', (err) => {
      console.log(`An error occurred: ${err.message}`);
      return false;
    })
    .on('end', () => {
      uploadResizedVideos(storePath, container);
      fs.unlink(file, () => {
      });
      return true;
    })
    .run();
}
/* End of compressing functions */

exports.outputPath = () => {
  return outputPath;
};

exports.convertVideo = async (file, folderName, containerName) => {
  // check output path exist and input video is exist
  if (fs.existsSync(outputPath)) {
    // make special folder to store compressed videos
    fs.mkdirSync(outputPath + folderName, { recursive: true });
    // make folder to store thumbnail
    // get video base name

    const basename = baseName();


    // get metadata of video
    return ffmpeg.ffprobe(file, (err, metadata) => {
      if (err) {
        console.log(`ERROR: ${err}`);
        return false;
      }

      // get video format and meta data
      const inputVideoWidth = metadata.streams[0].width ? metadata.streams[0].width : metadata.streams[1].width;
      const inputVideoHeight = metadata.streams[0].height ? metadata.streams[0].height : metadata.streams[1].height;

      // if (containerName === 'app-images') {
      //   takeThumbnail(file, 5, `${outputPath + folderName}/thumbnail`, containerName);
      // }

      // compress by checking input video size
      if (inputVideoWidth >= 1920 && inputVideoHeight >= 1080) {
        return compressFrom1080(file, basename, outputPath + folderName, containerName);
      } else if (inputVideoWidth >= 1220 && inputVideoHeight >= 720) {
        return compressFrom720(file, basename, outputPath + folderName, containerName);
      } else if (inputVideoWidth >= 854 && inputVideoHeight >= 480) {
        return compressFrom480(file, basename, outputPath + folderName, containerName);
      } else if (inputVideoWidth >= 640 && inputVideoHeight >= 360) {
        return compressFrom360(file, basename, outputPath + folderName, containerName);
      } else if (inputVideoWidth >= 426 && inputVideoHeight >= 240) {
        return compressFrom240(file, basename, outputPath + folderName, containerName);
      }
      return compressFrom144(file, basename, outputPath + folderName, containerName);
    });
  }
};

