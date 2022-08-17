require('dotenv').config()
const { Dog, Temper, Op } = require('../db.js');
const { getAllDogs, dbDogs, getDogs } = require('./api.js')

const getDogById = async (req, res) => {
    try {
        const {id} = req.params
        if (id.length < 5) {
            const dog = await getDogs()
            const idDog = dog.find(item => item.id == id)
            idDog
                ? res.status(200).send(idDog)
                : res.status(404).send('Dog Not Found')
        } else {
            const dbDog = await dbDogs()
            const doggy = dbDog.find(item => item.id == id)
            doggy
                ? res.status(200).send(doggy)
                : res.status(404).send('Dog Not Found')
        }
    } catch (error) {
        res.status(404).send(error)
    }
}

const getDog = async (req, res) => {
    try {
        const name = req.query.name
        let allDogs = await getAllDogs()
        if (name) {
            let dogName = allDogs.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
            dogName.length
                ? res.status(200).send(dogName)
                : res.status(404).send('Dog Not Found')
        } else {
            res.status(200).send(allDogs)
        }
    } catch (error) {
        console.log(error)
    }
}

const createDogs = async (req, res) => {

    try {
        let { name, weight, height, life_span, temperament, image } = req.body

        if (typeof name !== 'string') return res.status(400).send("The name need to be a string");

        if (!name || !weight || !height || !life_span || !temperament) {
            return res.status(404).send('Missing Data')
        } else {
            let dogCreated = await Dog.create({
                name,
                weight,
                height,
                life_span,
                image,
                temperament
            })
            const temperaments = temperament.split(',').map((item) => item.trim())
            temperaments.forEach( async (temp) => {
                const temperInDb = await Temper.findOne({
                    where: {
                        name: temp
                    }
                })
                await dogCreated.addTemper(temperInDb)
            })
            return res.status(201).send(dogCreated)
        }
    } catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
}

// extras

const deleteDog = async (req, res) => {
    const { id } = req.params;
    const dogToDelete = await Dog.findByPk(id)
    if (dogToDelete) {
        await dogToDelete.destroy();
        return res.send('Dog deleted');
    } else {
        return res.status(404).send('No existe ese Dog en la base de datos')
    }
}

const putDog = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, weight, height, life_span, temperament, image } = req.body;
        if (!id || id.length < 5) {
            return res.send('El id no es valido')
        } else {
            const updateDog = await Dog.findByPk(id);
            if (updateDog) {
                await updateDog.update({
                    name,
                    weight,
                    height,
                    life_span,
                    temperament,
                    image
                })
                return res.send(updateDog)
            } else {
                res.send('no se pudo encontrar el Dog con el id')
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createDogs, getDog, getDogById, deleteDog, putDog }