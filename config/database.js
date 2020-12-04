if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb+srv://adi:adi@cluster0.jrh1g.mongodb.net/adi?retryWrites=true&w=majority'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}
