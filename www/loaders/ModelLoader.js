var ditheredRegex = '(-dithered.png)';
Nimbus.LoadModel = function(data)
{
    if(-1 != data.search(ditheredRegex))
    {
        return new Nimbus.DitherHoloClip(256.0, 256.0, data);
    }
    else
    {
        return new Nimbus.HoloClip(256.0, 256.0, data);
    }
}

