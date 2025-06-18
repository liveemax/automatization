export const SIDE_LINKS = [
    {
        text:'Главная',
        link:'/',
    },
    {
        text:'Альфабот',
        link:'/alphabot',
    },
    {
        text:'Автоматизация проектов',
        link:'/automatization',
    }
]

export const LOCALSTORAGE_PATH = {
    chromePath: 'chromePath',
    alphabotProjects: 'alphabotProjects',
    alphabotRaffles: 'alphabotRaffles',
    alphabotUpdateTime: 'alphabotUpdateTime',
}

export const EXPORTED_LOCALSTORAGE_PATH = {
    alphabotProjects: 'alphabotProjects',
    alphabotUpdateTime: 'alphabotUpdateTime',
}

export const API = {
    browserCreate:'api/browser/create',
    browserClose:'api/browser/close',
    updateRaffles:'api/alphabot/update-raffles'
}

export const MIN_DELAY = 500;
export const MAX_DELAY = 5000;