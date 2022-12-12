import User from '../models/User.js'

export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        /* Se hara una llamada a la api por cada elemento del map, multiples llamadas, y por eso se usa Promise.all() */
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        )
        /* De cada amigo del usuario, se extrae la informacion que se quiere mandar al front unicamente */
        const formatFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )
        res.status(200).json(formatFriends)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const addRemoveFriend = async (req, res) => {
    try {
        /* Se trae el id del usuario, y el id del amigo que se quiere borrar, en caso de que se quiera agregar, ese campo estara vacio */
        const { id, friendId } = req.params
        /* Se busca al usuario */
        const user = await User.findById(id)
        const friend = await User.findById(friendId)

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter(id => id !== friendId)
            friend.friends = friend.friends.filter(id => id !== id)
        } else {
            user.friends.push(friendId)
            friend.friends.push(id)
        }

        /* Una vez que se hacen los cambios, se guarda con */
        await user.save()
        await friend.save()
        /* Luego se actualizan los amigos del usuario con los datos recien guardados */
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        )
        const formatFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )
        res.status(200).json(formatFriends)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


