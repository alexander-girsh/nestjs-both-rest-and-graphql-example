Technical stack
---
According to tech stack specified in the posted vacancy 
and the requirements listed in the task I selected stack `nest + @nest/graphql + @nest/swagger + class-validator`.

Interesting points
---
It was an interesting problem to reuse nest's REST DTO's documenting the GraphQL schemas.

For unit tests I used the simple in-memory storage with custom provider 
which imitates the rdbms behaviour and accords the dependencies inversion principle.

Weak spots
--- 
* No security headers solution (for e.g helmet etc. )
* No logger


Usage
===
Requirements
---
* `node.js 16.15.0 or above`

Development
---
* `yarn install`
* `yarn run start:dev`

Production
---
* Please no