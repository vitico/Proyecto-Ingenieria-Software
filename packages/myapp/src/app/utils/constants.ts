let API_URL = '';

export async function loadApiData() {
    console.log('x1');
    await fetch('/config.json')
        .then((data) => data.json())
        .then((data) => {
            API_URL = data.API_URL;
        })
        .catch(() => {
            console.log('it executes');
            API_URL = 'http://localhost:3000/';
        });
    console.log('x2');

    return '';
}

export { API_URL };
