# MD Pre Kroki! [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<p>
Mark Down Pre-Processor for 
<a href="https://kroki.io/">
    <img 
        src="https://kroki.io/assets/logo.svg" 
        width="4%"
    />
</a>
 Api Inline Coding based on GitLab Kroki Diagrams.  
</p>

[See Gitlab Kroki Diagrams integration](https://docs.gitlab.com/ee/administration/integration/kroki.html)

## NPM installation

````
npm install https://github.com/dgwnu/md-pre-kroki.git --save
````

## CLI-commands

Support the pre-processing of all **Kroki.io** api's (d.d. 17-03-20201).



````
npx mdprekroki <input dir> <output dir>
````

| Parm | Description |
|---------|:------------|
| input dir | Directory with some *kroki.io* coded files to pre-process |
| output dir | Directory with processes output .md files |

## Example

___Kroki Api PlantUML Mark Down___
<p><i>```plantuml</br>
Bob -> Alice : hello</br>
Alice -> Bob : hi</br>
```</i></p>

___Kroki Api Mark Down Image___

![kroki api](https://kroki.io/plantuml/svg/eNpzyk9S0LVTcMzJTE5VsFLISM3JyeeC8IDCTkBZoGAmANl1Cxw= "kroki.io")
