
// hidde show navbar

let principalUbication = window.scrollY;

window.onscroll = function() {

    let displacement = window.scrollY;

    // console.warn('principalubication', Math.round(principalUbication) );
    // console.log('desplazamiento',Math.round(displacement));


    if( principalUbication >= displacement ) {
        document.querySelector('#navbar').getElementsByClassName.top = '0';

    }else {

    }


    principalUbication = displacement;
    
    console.log(Math.round( principalUbication ));

} 

