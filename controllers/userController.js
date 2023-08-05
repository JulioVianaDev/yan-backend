const User = require('../models/User')
const bcrypt = require('bcrypt');
const fs = require('fs').promises;


module.exports = class userController{
  static async allUsers(req,res){
    try{
      const users = await User.find();
      const usersWithImageURLs = users.map(user => {
        const imageURL = user.image
            ? `${req.protocol}://${req.get('host')}/uploads/${user.image}`
            : null; // Set imageURL to null if no image
        return { ...user.toObject(), imageURL };
    });
      res.json(usersWithImageURLs);
    }catch(erro){
        console.log(erro);
        res.status(500).json({message: "Erro ao pegar todos os produtos."})
    }
  }
  static async registerUser(req,res){
    const {
      name,
      birthday,
      address,
      phone
    }= req.body

    let image = ""
    if(req.file){
      
      image = `${req.file.filename}`
    }
    const user = new User({
      name,
      birthday,
      address,
      phone,
      image
    })
    try {
      await user.save()
      const imageURL = `${req.protocol}://${req.get('host')}/uploads/${image}`;
      res.status(201).json({message: "Usuário cadastrado com sucesso",user,imageURL})
    } catch (error) {
      res.status(500).json({message: "Ocorreu um erro ao cadastrar o usuário, tente novamente mais tarde"})
    }
  }
  static async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndRemove(req.params.id)
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Delete the associated image
      if (user.image) {
        const imagePath = `uploads/${user.image}`;
        await fs.unlink(imagePath);
      }

      res.json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ocorreu um erro ao excluir o usuário" });
    }
  }
  static async editUser(req, res) {
    try {
        const {
            name,
            birthday,
            address,
            phone,
        } = req.body;

        let image = "";
        if (req.file) {
            image = `${req.file.filename}`;
        }

        const user = await User.findById(req.params.id); // Fetch the user by ID

        // Delete the old associated image if it exists
        if (user.image && req.file) {
            const oldImagePath = `uploads/${user.image}`;
            await fs.unlink(oldImagePath);
        }

        // Update the user's information
        user.name = name;
        user.birthday = birthday;
        user.address = address;
        user.phone = phone;
        user.image = image;
        const imageURL = `${req.protocol}://${req.get('host')}/uploads/${image}`;

        await user.save(); // Save the updated user

        res.json({user,imageURL});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao editar o usuário." });
    }
}

}