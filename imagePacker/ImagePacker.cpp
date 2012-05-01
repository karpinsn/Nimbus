// ImagePacker.cpp : Defines the entry point for the console application.
//

#include <stdio.h>
#include <string>
#include <iostream>

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
  
  std::cout << "Processing: " << argv[1] << " ... " << std::endl;
  for(int frameNumber = 0; frameNumber < 256; ++frameNumber)
  {
	char filename[1000];
	//A1whallon-bz_atsymbol_yahoo.com
	sprintf(filename, "%s/frames/%d.png", argv[1], frameNumber);
	IplImage* frame = cvLoadImage(filename);
	packImage(megaFrame, frame, frameNumber);
	cvReleaseImage(&frame);
  }

  char outfile[1000];
  sprintf(outfile, "data/%s.png", argv[1]);
  //"C:/Users/karpinsn/Desktop/ProcessData/A1whallon-bz_atsymbol_yahoo.com.png"
  cvSaveImage(outfile, megaFrame);
  cvReleaseImage(&megaFrame);

  std::cout << "Finished!" << std::endl;
  return 0;
}