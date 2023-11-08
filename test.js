const articles = [
    {id: 1, title: 'toto', categorie: 'science'}, // curr['id'] curr['categorie']
    {id: 2, title: 'titi', categorie: 'science'},
    {id: 3, title: 'tata', categorie: 'histoire'},
    {id: 4, title: 'pierre', categorie: 'sport'},
    {id: 5, title: 'paul', categorie: 'sport'},
    {id: 6, title: 'henry', categorie: 'science', tag: true}
]

const categories = articles.reduce((acc, curr, idx, arr) => {
    if(acc[curr.categorie]) {
        acc[curr.categorie]++
    } else {
        acc[curr.categorie] = 1
    }
    return acc
}, {})

console.log(categories)
console.log(Object.keys(categories).map(category => [category, categories[category]]))

// acc = {} => {science: 1}
// acc = {science: 1} => {science: 2}

