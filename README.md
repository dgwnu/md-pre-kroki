# MD Pre Kroki! [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Mark Down Pre-Processor for Kroki-Api code based on GitLab Mark Down processing

<p>
<a href="https://jena.apache.org/download/index.cgi">
    <img 
        src="https://kroki.io/assets/logo.svg" 
        width="4%"
    />
</a>
The binary distribution of Fuseki v3.17.0 is used to provide the service.  
</p>

## NPM installation

````
npm install https://github.com/dgwnu/md-pre-kroki.git --save
````

## CLI-commands

At this moment there is only some prelimannary support the pre-proces of the 'plantuml' api.



````
npx mdprekroki <input dir> <output dir>
````

| Parm | Description |
|---------|:------------|
| input dir | Directory with .kroki.md files to pre-process |
| output dir | Directory with processes output .md files |
Note[^1]  

## Example

Kroki Api PlantUML Mark Down:

<code>
```plantuml</br>
>Bob -> Alice : hello</br>
>Alice -> Bob : hi</br>
```</br>
</code>
Kroki Api Mark Down Image:

![kroki api](https://kroki.io/plantuml/svg/eNpzyk9S0LVTcMzJTE5VsFLISM3JyeeC8IDCTkBZoGAmANl1Cxw= "kroki.io")
