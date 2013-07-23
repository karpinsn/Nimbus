Nimbus.ButtonDivider = function()
{
    //  Create the button
    var buttonHTML = $('<div></div>');
    
    //  Classify
    buttonHTML.addClass('divider');
    
    //  Append it to the DOM
    $('#toolActions').append(buttonHTML);
};
