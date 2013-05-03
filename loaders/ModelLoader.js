var ditheredRegex = '(-dithered.png)';
var holoframeRegex = '(.png)';
var websocketRegex = 'ws://';
Nimbus.LoadModel = function(data)
{
    if(-1 != data.search(ditheredRegex))
    {
        return new Nimbus.DitherHoloClip(256.0, 256.0, data);
    }
    else if(-1 != data.search(holoframeRegex))
    {
        //return new Nimbus.HoloClip(256.0, 256.0, data);
        return new Nimbus.HoloDepthImage(512.0, 512.0, 512.0, 512.0, data);
    }
    else if(-1 != data.search(websocketRegex))
    {
        return new Nimbus.HoloWebSocket(512.0, 512.0, data);
		//return new Nimbus.HoloDepthWebSocket(2, 2, 576.0, 576.0, data);
    }
}

