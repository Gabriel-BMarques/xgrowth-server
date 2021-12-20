const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const convert = require('./convert');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../../../.env'),
  sample: path.join(__dirname, '../../../../.env.example'),
});

const getStream = require('into-stream');
const azureStorage = require('azure-storage');

const blobService = azureStorage.createBlobService();
const containerName = 'app-images';
const handleError = (err) => {
  console.log(err);
};
const getBlobName = (originalName = '') => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  // regex to remove emojis from filename
  originalName = originalName
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    )
    // remove all white space
    .replace(/\s/g, '');
  return `${identifier}-${originalName}`;
};

function uploadResizedImage(buffer, blobName, width) {
  sharp(buffer)
    .resize({ width })
    .toBuffer()
    .then((outputBuffer) => {
      const extension = blobName.split('.').pop();
      const blobNameAux = blobName.split('.', 1);
      const newBlobName = `${blobNameAux}-SM.${extension}`;
      let stream;
      let streamLength;
      stream = getStream(outputBuffer);
      streamLength = outputBuffer.length;
      blobService.createBlockBlobFromStream(containerName, newBlobName, stream, streamLength, (err) => {
        if (err) {
          handleError(err);
        }
      });
    });
}

function getContainerName(url) {
  const container = url.split('https://weleverimages.blob.core.windows.net/').pop().split('/')[0];
  return container;
}

async function upload(file, res) {
  const videoTypes = ['mp4', 'mkv', 'mpeg', 'avi', 'mov', 'wmv'];
  const gifTypes = ['gif'];
  const type = file.mimetype.split('/').pop();
  const blobName = getBlobName(file.originalname); // id-filename.extension
  const stream = getStream(file.buffer);
  const streamLength = file.buffer.length;
  const uploadedFilePath = `${__dirname}/inputs/${blobName}`;
  const outputPath = `${__dirname}/outputs/`;
  const folderName = `${blobName.split('.')[0]}`;

  if (videoTypes.includes(type)) {
    fs.writeFile(uploadedFilePath, file.buffer, (error) => {
      if (error) {
        console.log(error);
      } else {
        fs.mkdirSync(`${outputPath + folderName}/thumbnail`, { recursive: true });
        convert.takeThumbnail(
          uploadedFilePath,
          5,
          `${outputPath + folderName}/thumbnail`,
          containerName,
          blobName,
          res
        );
      }
    });
  } else if (gifTypes.includes(type)) {
    uploadResizedImage(file.buffer, blobName, 250);
  }

  // eslint-disable-next-line max-len
  blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (err) => {
    if (err) {
      res.status(500);
    } else {
      if (!videoTypes.includes(type) && type !== 'gif') {
        uploadResizedImage(file.buffer, blobName, 860);
        res.json({ blob: blobName, type: 'image/document' });
      } else if (type !== 'gif') {
        convert.convertVideo(uploadedFilePath, folderName, containerName);
      } else {
        res.json({ blob: blobName, type: 'gif' });
      }
    }
  });
}

/**
 * Create File
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    await upload(req.files[0], res);
  } catch (err) {
    res.json(err);
  }
};

/**
 * Create File
 * @public
 */
exports.editorUpload = async (req, res, next) => {
  try {
    const file = req.files[0];
    const videoTypes = ['mp4', 'mkv', 'mpeg', 'avi', 'mov', 'wmv'];
    const type = file.mimetype.split('/').pop();
    const blobName = getBlobName(file.originalname); // id-filename.extension
    const stream = getStream(file.buffer);
    const streamLength = file.buffer.length;

    // eslint-disable-next-line max-len
    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (err) => {
      if (err) {
        res.status(500);
      } else {
        if (!videoTypes.includes(type) && type !== 'gif') {
          uploadResizedImage(file.buffer, blobName, 860);
          res.json({ imageUrl: 'https://weleverimages.blob.core.windows.net/app-images/' + blobName });
        } else {
          res.json({ imageUrl: 'https://weleverimages.blob.core.windows.net/app-images/' + blobName });
        }
      }
    });
  } catch (err) {
    res.json(err);
  }
};

const getOriginalName = (fileUrl) => {
  const origName = fileUrl.replace('https://weleverimages.blob.core.windows.net/app-images/', '');
  return origName;
};

exports.removeImage = async (req, next) => {
  Object.entries(req.body).forEach(([key]) => {
    const blobName = getOriginalName(req.body[key]);
    blobService.deleteBlobIfExists(containerName, blobName, (err) => {
      if (err) {
        handleError(err);
      }
    });
  });
};
