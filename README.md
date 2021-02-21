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

<textarea>
  At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
</textarea>

<p>
<code>
```plantuml</br>
>Bob -> Alice : hello</br>
>Alice -> Bob : hi</br>
```</br>
</code>
</p>


Kroki Api Mark Down Image:

![kroki api](https://kroki.io/plantuml/svg/eNpzyk9S0LVTcMzJTE5VsFLISM3JyeeC8IDCTkBZoGAmANl1Cxw= "kroki.io")
