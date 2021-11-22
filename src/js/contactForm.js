'use strict';

    const FORM = document.querySelector('form');
    const INPUT_NAME = FORM.querySelector('#name');
    const INPUT_LAST_NAME = FORM.querySelector('#last_name');
    const INPUT_PHONE = FORM.querySelector('#phone');
    const INPUT_EMAIL = FORM.querySelector('#email');
    const TEXTAREA_MESSAGE = FORM.querySelector('#message');




( function() {


    FORM.setAttribute('novalidate', true );

    // formatear el 
    INPUT_NAME.addEventListener('keyup', function(e) { keySecure(e); hiddenChildInvalidFeedback( e.target ); });
    INPUT_LAST_NAME.addEventListener('keyup', function(e) { keySecure(e); hiddenChildInvalidFeedback( e.target );} );
    INPUT_PHONE.addEventListener('keyup', function(e) { keySecure(e); hiddenChildInvalidFeedback( e.target );} );
    INPUT_EMAIL.addEventListener('keyup', function(e) { keySecure(e); } );
    TEXTAREA_MESSAGE.addEventListener('keyup', function(e) { keySecure(e); hiddenChildInvalidFeedback( e.target );} );



    // INPUT_EMAIL.addEventListener("blur", blur );

    FORM.addEventListener('keypress', (e) => {
        if( e.code == 'Enter' || e.code == 'NumpadEnter' ){
            e.preventDefault();
        }
    });




    FORM.addEventListener('submit', async ( e ) => {
        // validateEmail( INPUT_EMAIL );


        try {

            e.preventDefault()


            await Promise.all([
                checkLengthElementForm( INPUT_NAME, 3, 20 ),
                checkLengthElementForm( INPUT_LAST_NAME, 3, 20 ),
                checkLengthElementForm( INPUT_PHONE, 9, 14 ),
                checkLengthElementForm( INPUT_EMAIL, null, 320 ),
                checkLengthElementForm( TEXTAREA_MESSAGE, 1, 2060 )
            ]);

       
            
            const data = {
                'name': INPUT_NAME.value,
                'last_name': INPUT_LAST_NAME.value,
                'phone': INPUT_PHONE.value,
                'email': INPUT_EMAIL.value,
                'message': TEXTAREA_MESSAGE.value,
            }
        
            sendData( data );
    

        } catch (error) {
            throw new Error( error );
        }
        
    });
    

}) ();


function sendData( data ) {

    
    const headers = {
        'content-type' :'application/json'
    }
    const req = new Request('http://localhost:3000/sendMail', { method: 'POST', body: JSON.stringify(data), headers });

    return handledFetch( req )
    .then( resp => resp.json() );



}


const handleError = (response) => {
    if (!response.ok) throw Error(response.status);
    return response;
 }
 
 const handledFetch = (request) => {
    return fetch(request)
      .then(handleError)
 }


// se ejecutara sobre el campo email cuando se salga el foco
function blur() {
    validateEmail( this );
}


// admitir solo los key que están permitidos
function keySecure( event ) {
    if( event.target.id == 'phone' ){
        numberOnly( event.target.value, event );

    }else if( event.target.id =='name' || event.target.id == 'last_name' ){
        letterOnly( event.target.value, event );
    }else if( event.target.id =='email' ) {
        validateEmail( event.target );
    }

}

function checkLengthElementForm( element, min, max ) {

    return new Promise( ( resolve, reject ) => {

        if( element.value.length < min ) {
            checkChildInvalidFeedback( element, `El largo minimo requerido es ${ min }`);
            reject( false );
            return;
        }else if( element.value.length > max ) {
            checkChildInvalidFeedback( element, `El largo máximo permitido es ${ max }`);
            reject( false );
            return;
        } else  if( min == 0 && element.value.length < 1 ) {
            checkChildInvalidFeedback( element, 'Este campo es requerido');
            reject( false );
            return;
        }else {
            resolve( true );
            return;
        }

    });

}


function letterOnly( currentValue, event ) {

    const REG_EXP = /[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g;

    if( currentValue.length > 0 ) {

        const CURRENT_LETTERS = currentValue.match( REG_EXP );

        if( CURRENT_LETTERS != null ){

            event.target.value = String(CURRENT_LETTERS.join('')).trim();

        }
        else{
            event.target.value = '';
        }
    }

}


function numberOnly( currentValue, event ) {

    const REG_EXP = /[0-9]{0,14}/;

    if( currentValue.length > 0 ) {

        const CURRENT_NUMBERS = currentValue.match( REG_EXP );

        if( CURRENT_NUMBERS != null ){
            event.target.value = String(CURRENT_NUMBERS).trim();
        }
        else{
            event.target.value = '';
        }

    }

}


function validateEmail( formControl ) {

    if( formControl ){
        const EMAIL_REGEX = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
        if( EMAIL_REGEX.test(formControl.value) ){
            hiddenChildInvalidFeedback( formControl );
        }
        else {
            checkChildInvalidFeedback( formControl, 'Ingrese un Email correcto' );
        }
    }

}


// mostrar elemento creado o crearlo
function  checkChildInvalidFeedback( element, text ) {

    if( element.parentNode.children.length > 1 ) {
        showChildInvalidFeedback( element );
    }
    else {
        const DIV_INVALID = createDivInvalidFeedback( text );
        appendChildInvalidFeedback( element , DIV_INVALID );
    }

}


function createDivInvalidFeedback( text ) {

    const DIV = document.createElement('div');
    DIV.classList.add('invalid_feedback_custom');
    DIV.innerHTML = text; 
    return DIV;
}

function appendChildInvalidFeedback( element, elementAppend ) {
    if( element.parentNode.children.length > 1 );
    element.parentNode.append( elementAppend );
    return;
}


function hiddenChildInvalidFeedback( element ) {
    if( element.parentNode.children.length > 1 ) {
        element.parentNode.querySelector('.invalid_feedback_custom').style = 'display:none';
    }
}


function showChildInvalidFeedback( element ) {

    if( element.parentNode.children.length > 1 ) {
        element.parentNode.querySelector('.invalid_feedback_custom').style = 'display:block';
    }
}


