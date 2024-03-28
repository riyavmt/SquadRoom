const Message = require("../model/message");
const archivedChat  =require("../model/archivedChat");

exports.backup = async (req,res) => {
    try {

        const data = await Message.findAll();

        // Create archived chat messages in bulk and this is better than inserting one by one
        await archivedChat.bulkCreate(data);


        for (const message of data) {
            await message.destroy();
        }

        console.log('Backup Done', new Date());
    } catch (err) {
        console.error('Backup Error:', err);
    }
}

module.exports= backup;