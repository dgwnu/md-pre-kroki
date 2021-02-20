# MD Pre Kroki! [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Mark Down Pre-Processor for Kroki-Api code based on GitLab Mark Down processing

## NPM installation

````
npm install https://github.com/dgwnu/md-pre-kroki.git --save
````

## CLI-commands

At this moment there is only some prelimannary support the pre-proces of the 'plantuml' api.

### Services

````
npx mdprekroki <input dir> <output dir>
````

| Parm | Description |
|---------|:------------|
| input dir | Directory with .kroki.md files to pre-process |
| output dir | Directory with processes output .md files |

## Examples

### Test PlantUML 01

Kroki Api PlantUML Mard Down:

```plantuml
Bob -> Alice : hello
Alice -> Bob : hi
```

Kroki Api Mark Down Image:

![kroki api](https://kroki.io/plantuml/svg/eNpzyk9S0LVTcMzJTE5VsFLISM3JyeeC8IDCTkBZoGAmANl1Cxw= "kroki.io")

### Test PlantUML 02

Kroki Api PlantUML Mard Down:

```plantuml
skinparam monochrome true
skinparam ranksep 20
skinparam dpi 150
skinparam arrowThickness 0.7
skinparam packageTitleAlignment left
skinparam usecaseBorderThickness 0.4
skinparam defaultFontSize 12
skinparam rectangleBorderThickness 1

rectangle "Main" {
  (main.view)
  (singleton)
}
rectangle "Base" {
  (base.component)
  (component)
  (model)
}
rectangle "<b>main.ts</b>" as main_ts

(component) ..> (base.component)
main_ts ==> (main.view)
(main.view) --> (component)
(main.view) ...> (singleton)
(singleton) ---> (model)
```
Kroki Api Mark Down Image:

![kroki api](https://kroki.io/plantuml/svg/eNplj0FvwjAMhe_5FVZP40CgaNMuUGkcdttp3Kc0NSVq4lRxGNKm_fe1HULuuD37-bOfuXPUm2QChEjRnlIMCDmdUfHNSYY6xh42a9Fsegflk-yYlOLlcHK2I2SGtX4WZm9sZ1o8uOzxxbuWAlIGj8cshs6M1jDuY2owyU2P8jAezdnn10j53X0hlBsZFW021Pq7HaVSNw-KN-OogG8F8BAGqT8dXhZjxW4cyJEW6kcC-yHWFagHqW0MfaThhYmaVyE26P_x27qaDmXeruqqAMMw1h-ZlRI4aF3dX7hOwm5XzfIKDctlNcshPT1tFa8JPYAj-Zf5F065sqM= "kroki.io")

