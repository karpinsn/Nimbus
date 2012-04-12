// ImagePacker.cpp : Defines the entry point for the console application.
//

#include <stdio.h>

//	OpenCV includes
#include <cv.h>
#include <highgui.h>

void packImage(IplImage* dest, IplImage* source, int frame)
{
  int rows = dest->height / source->height;
  int cols = dest->width / source->width;

  int rowPos = frame / cols;
  int colPos = frame % cols;

  int xOffset = source->width * colPos;
  int yOffset = source->height * rowPos;

  for (int y = 0; y < source->height; y++) 
  {
	for (int x = 0; x < source->width; x++) 
	{
	  for(int c = 0; c < 3; ++c)
	  {
		((uchar*)(dest->imageData + dest->widthStep*(y+yOffset)))[(x+xOffset)*3+c] = ((uchar*)(source->imageData + source->widthStep*y))[x*3+c];
	  }
	}
  }
}

int main(int argc, char* argv[])
{
  IplImage* megaFrame = cvCreateImage(cvSize(4096,4096), IPL_DEPTH_8U, 3);
  
  for(int frameNumber = 0; frameNumber < 64; ++frameNumber)
  {
	char filename[1000];
	sprintf(filename, "C:/Temp/Frames/%04d.png", frameNumber);
	IplImage* frame = cvLoadImage(filename);
	packImage(megaFrame, frame, frameNumber);
	cvReleaseImage(&frame);
  }

  cvSaveImage("C:/Temp/megaFrame.png", megaFrame);
  cvReleaseImage(&megaFrame);
  return 0;
}