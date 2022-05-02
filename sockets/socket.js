const { io } = require('../index');
const Band = require('../public/models/band');
const Bands = require('../public/models/bands');

const bands = new Bands();
//console.log('init server');

bands.addBand(new Band('La banda del tomate'));
bands.addBand(new Band('Los Totoras'));
bands.addBand(new Band('Los Piojos'));
bands.addBand(new Band('Los Palmeras'));
bands.addBand(new Band('Queen'));

//console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    client.emit('active-bands',bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });

 

    client.on('mensaje', ( payload ) => {
        console.log('nuevo-mensaje', payload);0000
    });
    client.on('vote-band', ( payload ) => {
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    // escuchar evento add-band

    client.on('add-band', ( payload ) => {
        //bands.voteBand(payload.name);
        const newBand = new Band(payload.name)
        bands.addBand(newBand);
        io.emit('active-bands',bands.getBands());
        //console.log(payload.name);

    });


    client.on('delete-band', ( payload ) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
        //console.log(payload.id);

    });

    

    // client.on('emitir-mensaje', ( payload ) => {
    //     console.log('nuevo-mensaje', payload); // Consola del servidor 
    //     //io.emit( 'nuevo-mensaje', payload ); //Emite a todos
    //     client.broadcast.emit( 'nuevo-mensaje', payload );   // Emite a todos menos al que lo emitio

    // }); 


});
