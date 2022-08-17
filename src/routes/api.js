require('dotenv').config();
const {YOUR_API_KEY} = process.env
const axios = require ('axios')
const { Dog, Temper } = require('../db.js')

const getDogs = async () => {
    try {
    let perritos = []
    let dogs = await axios(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`)
    let data = dogs.data
    const result = data.map(({id, name, weight, height, life_span, temperament, image}) => {
        perritos.push({
            id: id,
            name: name,
            weight: weight.metric,
            height: height.metric,
            life_span: life_span,
            temperament: temperament,
            image: image.url
        });
    });
    return perritos
    } catch (error) {
        console.log(error)
    }
}

const dbDogs = async () => {
    return await Dog.findAll({
        include:{
            model: Temper,
            attributes: ['name'],
        through: {
            attributes: []
            }
        }
    })
}

const getAllDogs = async () => {
    const apiInfo = await getDogs();
    const dbInfo = await dbDogs();
    return apiInfo.concat(dbInfo)
}

const getTemperament = async (req, res) => {
        try {
            let dogs = await axios(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`)
            let data = await dogs.data
            let temperamentos = data.map(item => item.temperament)
            let string = temperamentos.toString()
            let noSpace = string.trim()
            let array = noSpace.split(/\s*,\s*/)
            let tempers = array.filter(item => item);
            let temperFilter =[... new Set (tempers)];
            temperFilter.forEach(item => {
                Temper.findOrCreate({
                    where: {name: item},
                })
            })
            const allTempers = await Temper.findAll()
            res.send(allTempers)
        } catch (error) {
            res.send(error)
        }
    }
    
    module.exports = {getAllDogs, dbDogs, getTemperament, getDogs}
    
    
    





















    
    
    // space.forEach(item => {
    //     Temper.findOrCreate({ where: {name: item} });
    // });
    // const allTempers = await Temper.findAll();
    // return res.status(200).send(allTempers)








    






    
    
    
    // const getTemperament = async (req, res) => {
    //         let temperamentos = []
    //         let dogs = await axios(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`)
    //         let data = await dogs.data
    //         data.forEach(({temperament}) => {
    //             temperamentos.push({
    //                 temperament: temperament?.split(',')
    //             })
    //         })
    //         const newData = temperamentos.map(item => Object.values(item))
    //         const otherData = newData.flat(2)
    //         const mySet = new Set(otherData)
    //         const array = Array.from(mySet)
    //         const space = array.map(item => item?.trim())
    //         space.forEach(item => {
    //             Temper.findOrCreate({ where: {name: item}});
    //         });
    //         const allTempers = await Temper.findAll()
    //         console.log("🚀 ~ file: api.js ~ line 60 ~ getTemperament ~ space", allTempers)
    //         res.send(allTempers)
    //     }
        





// const getDogs = async () => {

//     try {
//         let dogs = []
//         const url = `https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`
//         for(let i = 1; i < 3; i++) {
//             let pages = await axios(url);
//             pages.data.forEach(({id, name, weight, height, life_span, temperament, image}) => {
//                 dogs.push({
//                     id: id,
//                     name: name,
//                     weight: weight.imperial,
//                     height: height.imperial,
//                     life_span: life_span,
//                     temperament: temperament,
//                     image: image
//                 });
//             });
//             url = pages.data.next;
//         }
//         return dogs
//     } catch (error) {
//         console.log(error)
//     }
// }
