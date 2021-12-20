
const azureStorage = require('azure-storage');

const blobService = azureStorage.createBlobService();

const videoDefinitions = [
    { size: '1080', definition: '1920x1080' },
    { size: '720', definition: '1280x720' },
    { size: '480', definition: '854x480' },
    { size: '360', definition: '640x360' },
    { size: '240', definition: '256x144' }
  ];

function getContainerName(url) {
    return url
      .split('https://weleverimages.blob.core.windows.net/')
      .pop()
      .split('/')[0];
}

async function blobExists(container, blobName) {
    const promise = new Promise((resolve, reject) => {
        try {
            blobService.doesBlobExist(container, blobName, (err, result) => {
                if (!err) {
                    resolve(result.exists);
                } else {
                    reject(err);
                }
            })
        } catch (error) {
            reject(new Error(error));
        }
    });
    return promise;
}

exports.videoTypes = ['mp4', 'mkv', 'mpeg', 'avi', 'mov', 'wmv'];

exports.getVideoSources = async (file) => {
    let videoSources = [];
    let container = getContainerName(file.url);
    if (container === 'app-images') {
        let blobNameWithExtension = file.url.split('https://weleverimages.blob.core.windows.net/app-images/').pop();
        let blobExtension = blobNameWithExtension.split('.').pop();
        let blobName = blobNameWithExtension.split('.')[0];
        for await (let vd of videoDefinitions) {
            let src = `https://weleverimages.blob.core.windows.net/app-images/${blobName}-${vd.definition}.${blobExtension}`;
            let fileExists = await blobExists(container, `${blobName}-${vd.definition}.${blobExtension}`);
            if (fileExists) {
                videoSources.push({ size: vd.size, src });
                file.Thumbnail = `https://weleverimages.blob.core.windows.net/app-images/${blobName}-thumbnail.png`;
            };
        }
    } else {
        videoSources.push({ size: '1080', src: file.url, type: file.Type });
        file.Thumbnail = `${file.url.split('/f')[0]}-output/f_800_000001.png`;
    }
    file.Processing = videoSources.length === 0;
    return videoSources;
}

exports.getBlobName = (url) => {
    const blobName = url?.split('https://weleverimages.blob.core.windows.net/').pop();
    const extension = url?.split('.').pop();
    const fileName = blobName.split('.', 1);
    const newBlobName = `${fileName}-SM.${extension}`;
    return newBlobName;
  }
  
exports.getThumbnail = (file) => {
    const containerName = file.url?.split('https://weleverimages.blob.core.windows.net/')
    .pop()
    .split('/')[0];
    switch (containerName) {
    case 'cblx-img':
        if (file.isVideo) {
        const urlAux = file?.url?.split('/f')[0];
        return urlAux + '-output/f_200_000001.jpg';
        } else {
        if (file?.Type === 'gif') {
            return file?.url;
        } else {
            return `${file?.url}-SM`;
        }
        }
    case 'app-images':
        if (file.isVideo) {
        const blobName = file?.url?.split('https://weleverimages.blob.core.windows.net/')
            .pop()
            .split('.')[0];
        return blobName ? `https://weleverimages.blob.core.windows.net/${blobName}-thumbnail.png` : null;
        } else {
        if (file?.Type === 'gif') {
            return file?.url;
        } else {
            const blobName = this.getBlobName(file?.url);
            return blobName ? `https://weleverimages.blob.core.windows.net/${blobName}` : null;
        }
        }
    }
}