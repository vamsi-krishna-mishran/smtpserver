
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const morgan = require('morgan');




const app = express();

app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((err, req, res, next) =>
{
    console.error(err.stack);
    res.status(500).send('Something broke!');
});



const port = process.env.PORT || 3000;

app.post('/details', (req, res) =>
{
    const { title, message } = req.body;
    
    const sender = process.env.EMAIL_USER
    const pwd = process.env.EMAIL_PASS
    let receiver = process.env.EMAIL_TO
    if('target' in req.body){
        receiver=req.body.target;
    }
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: true,
        auth: {
            user: sender,
            pass: pwd
        }
    });

    let mailOptions = {
        from: sender,
        to: receiver,
        subject: 'Mail from portfolio',
        html: `<h1>${title}</h1><p>${message}</p>`
    };

    transporter.sendMail(mailOptions, (error, info) =>
    {
        if (error)
        {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Message sent successfully!');
    });
});

app.listen(3000, () =>
{
    console.log('Server is running on port 3000');
});

module.exports = app;
