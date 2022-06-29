
let apiKey = '3f301be7381a03ad8d352314dcc3ec1d';
let requestToken: string;
let username: string;
let password: string;
let sessionId: string;
let listId = '7101979';

let loginButton = document.getElementById('login-button') as HTMLButtonElement;
let searchButton = document.getElementById('search-button') as HTMLButtonElement;
let searchContainer = document.getElementById('search-container') as HTMLElement;

loginButton.addEventListener('click', async () => {
    await criarRequestToken();
    await logar();
    await criarSessao();
})

searchButton.addEventListener('click', async () => {
    let list = document.getElementById("list");
    if (list) {
    list.outerHTML = "";
}

let query = document.getElementById('search') as HTMLInputElement;

let listMovies = await procurarFilme(query.value);

let ul = document.createElement('ul');
ul.id = "list"

for (const movie of listMovies.results) {
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(movie.original_title))
    ul.appendChild(li)
}
    searchContainer.appendChild(ul);
})

function preencherSenha() {
    let valuePassword = document.getElementById('password') as HTMLInputElement;
    password = valuePassword.value;
    validateLoginButton();
}

function preencherLogin() {
    let user = document.getElementById('login') as HTMLInputElement;
    username =  user.value;
    validateLoginButton();
}

function preencherApi() {
    let valueKey = document.getElementById('api-key') as HTMLInputElement
    apiKey = valueKey.value;
    validateLoginButton();
}

function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
}

class HttpClient {
    static async get({ url, method, body = null} ) {
        return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(method, url, true);
        request.onload = () => {
            if (request.status >= 200 && request.status < 300) {
            resolve(JSON.parse(request.responseText));
            } else {
            reject({
                status: request.status,
                statusText: request.statusText
            })
            }
        }
        request.onerror = () => {
            reject({
            status: request.status,
            statusText: request.statusText
            })
        }
        if (body) {
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            body = JSON.stringify(body);
        }
        request.send(body);
        })
    }
}

async function procurarFilme(query: string) {
    query = encodeURI(query)
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
        method: "GET"
    })
    return result;
}

async function adicionarFilme(filmeId: number) {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
        method: "GET"
    })
    return result;
}

async function criarRequestToken () {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
        method: "GET"
    })
    requestToken = result.request_token;
}

async function logar() {
    await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
        method: "POST",
        body: {
        username: `${username}`,
        password: `${password}`,
        request_token: `${requestToken}`
        }
    })
}

async function criarSessao() {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
        method: "GET"
    })
    sessionId = result.session_id;
}

async function criarLista(nomeDaLista: string, descricao: string) {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
        method: "POST",
        body: {
        name: nomeDaLista,
        description: descricao,
        language: "pt-br"
        }
    })
    return result;
}

async function adicionarFilmeNaLista(filmeId: number, listaId: number) {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
        method: "POST",
        body: {
        media_id: filmeId
        }
    })
    return result;
}

async function pegarLista() {
    let result = await HttpClient.get({
        url: `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
        method: "GET"
    })
    return result;
}