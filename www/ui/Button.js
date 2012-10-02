Nimbus.Button = function(buttonName, clickFunction)
{
    this.buttonName = buttonName;
    
    var buttonGroup = undefined;
    var click = clickFunction;

    //  Create the button
    var buttonHTML = $('<div></div>');
    buttonHTML.attr('id', buttonName);
    
    //  Classify
    buttonHTML.addClass('toolBase');
    buttonHTML.addClass(this.buttonName);

    //  Style
    buttonHTML.css({display: "block"});

    this.glowOn = function()
    {
        $("#" + this.buttonName).toggleClass("toolSelected");
        $("#" + this.buttonName).addClass("toolHover");
    }

    this.glowOff = function(d)
    { 
        $("#" + this.buttonName).toggleClass("toolSelected");
        $("#" + this.buttonName).removeClass("toolHover");
    }

    this.deselect = function()
    {
        $("#" + this.buttonName).removeClass("toolSelected");
    }

    this.onclick = function()
    {
        if(typeof buttonGroup !== "undefined")
        {
            buttonGroup.removeSelection();
            $("#" + this.buttonName).addClass("toolSelected");
        }
        $("#" + this.buttonName).toggleClass("toolSelected");
        click();
    }

    this.setButtonGroup = function(group)
    {
        buttonGroup = group;
    }

    buttonHTML.attr('onmouseover', 'Nimbus.ui.' + this.buttonName + '.glowOn()');
    buttonHTML.attr('onmouseout', 'Nimbus.ui.' + this.buttonName + '.glowOff()');
    buttonHTML.attr('onclick', 'Nimbus.ui.' + this.buttonName + '.onclick()');

    //  Append it to the DOM
    $('#toolActions').append(buttonHTML);
};
