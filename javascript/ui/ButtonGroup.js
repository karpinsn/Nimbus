Nimbus.ButtonGroup = function()
{
    var buttons = [ ];

    this.addButton = function(button)
    {
        button.setButtonGroup(this);
        buttons.push(button);
    }

    this.removeSelection = function()
    {
        $.each(buttons, function(i, val)
                {
                    val.deselect();
                });
    }
};
