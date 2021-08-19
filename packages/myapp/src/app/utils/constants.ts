let API_URL = '';

export async function loadApiData() {
    await fetch('/config.json')
        .then((data) => data.json())
        .then((data) => {
            API_URL = data.API_URL;
        })
        .catch(() => {
            API_URL = 'http://localhost:3000/';
        });
    console.log('x2');

    return '';
}

export { API_URL };
