import axios from 'axios';

const fetchVideoUrls = async (prompt) => {
    const response = await axios.post('http://52.139.173.249:3000/textToVideo', {
        script: prompt
    });
    return response.data.videoPaths;
}

const download = async (url) => {
    const response = await axios.get(url, { responseType: 'blob' });
    return URL.createObjectURL(new Blob([response.data]), { type: 'video/mp4' });
}

const downloadAll = async (prompt) => {
    const videoUrls = await fetchVideoUrls(prompt);
    const blobUrls = [];
    for (let i = 0; i < videoUrls.length; i++) {
        const blobUrl = await download(videoUrls[i]);
        blobUrls.push(blobUrl);
    }
    console.log(blobUrls.length);
    console.log('all videos downloaded');
    return blobUrls;
}

export default downloadAll;console.log('video downloaded');