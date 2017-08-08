#!/bin/bash
rm -f index.zip
cd src
zip -Xr ../index.zip *
cd ..
aws lambda update-function-code --function-name WeatherKnot --zip-file fileb://index.zip