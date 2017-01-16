var nbPatterns = 12, // nb of patterns in data folder
    patterns = [],
    imgs = [],
    selectedIds = [],
    size, // size of the patterns basedd on width of the first one
    sizeSlider,
    nx, ny, // nb patterns on x and y
    mx, my; // margins x and y

function preload(){
    patterns = ( new Array( nbPatterns ) ).fill( 0 ).map( ( d, i ) => loadImage( 'data/' + i + '.svg' ) );
    imgs = ( new Array( nbPatterns ) ).fill( 0 ).map( ( d, i ) => {
        let tmp = new Image();
        tmp.src = 'data/' + i + '.svg';
        return tmp;
    } );
}

function setup(){
    var c = createCanvas( windowWidth, windowHeight );
    c.parent( "#container" );
    c.drop( addImg );

    c.canvas.addEventListener( 'click', redraw );

    imageMode( CENTER );

    size = min( patterns[ 0 ].width, 100 );
    sizeSlider = createSlider( 20, max( size, 100 ), size, 1 );
    sizeSlider.parent( "#ui" );
    sizeSlider.changed( resizeImgs );

    imgs[ 0 ].classList.toggle( 'selected' );
    selectedIds.push( 0 );

    imgs.forEach( ( img, id ) => {
        document.querySelector( '#menu' ).appendChild( img );

        img.addEventListener( 'click', e => {
            img.classList.toggle( 'selected' );

            if( img.classList.contains( 'selected' ) ){
                selectedIds.push( id );
            }
            else{
                selectedIds = selectedIds.filter( index =>{
                    return +index != +id;
                } );
            }

            redraw();
        } );
    } );

    resizeImgs();
}

function addImg( file ){
    patterns.push( loadImage( file.data ) );

    let img = new Image();
    img.src = file.data;
    imgs.push( img );
    let id = imgs.length - 1;

    document.querySelector( '#menu' ).appendChild( img );

    img.addEventListener( 'click', e => {
        img.classList.toggle( 'selected' );

        if( img.classList.contains( 'selected' ) ){
            selectedIds.push( id );
        }
        else{
            selectedIds = selectedIds.filter( index =>{
                return +index != +id;
            } );
        }

        redraw();
    } );

}

function resizeImgs(){
    size = sizeSlider.value()
    initMarges();
}

function initMarges(){
    nx = ~~( width / size ) + 1;
    mx = ( width - nx * size ) / 2;
    ny = ~~( height / size ) + 1;
    my = ( height - ny * size ) / 2;

    redraw();
}

function draw(){
    clear();
    if( selectedIds.length ){
        for( let y = 0.5; y < ny; y++ ){
            for( let x = 0.5; x < nx; x++ ){
                push();
                translate( mx + x * size, my + y * size );
                rotate(HALF_PI * ~~random( 4 ) );
                if( random( 1 ) < .5 ) scale( -1, 1 );
                image( patterns[ random( selectedIds ) ], 0, 0, size, size );
                pop();
            }
        }
    }
    noLoop();
}

function windowResized(){
    resizeCanvas( windowWidth, windowHeight );
    initMarges();
}
