# mooncat_traits

Simple Downloader for Mooncat Traits

Setup

`npm i`

Run

`node index.js`

Generates two files 

- mooncats.json which is a full copy of the data returned from the API here (https://api.mooncat.community/traits/1)
- mooncats.min.json which is a minified copy of the data without additional things like accessories etc

In order to upload to GitHub mooncats.json is split into 3 files with 8480 records each to stay below the 25Mb file size limit.
- mooncats_0.json
- mooncats_1.json
- mooncats_2.json
