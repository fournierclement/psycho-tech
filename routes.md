# Describe api routes

## Flexibles Ressources

### Moderators
- __Create : Post /moderators__
    - admin : { 201, /moderators/:id }, modo, student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
    - _Bool admin, String email, String name, String password_
- __Read : Get /moderators/:id__
    - admin, modo : { email, name, admin }, student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
- __Update : Put /moderators/:id__
    - admin, modo(:id) : { 204, No Content }, modo, student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
    - _email, name, password_
- __Delete  : Delete  /moderators/:id__
    - admin, modo(:id) : { 204, No Content }, modo, student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
- __Search  : Get     /moderators__
    - admin, modo : [{ email, name, admin }], student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
    - _String name_

### Sessions
- __Create : Post sessions__
    - admin, modo : { 201, Sessions/:label }, student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
    - _String label (date: now, open: true), String code, String desc_
- __Read : Get sessions/:label__
    - admin, modo, student : { label, desc, open, result }, guest : { Error 401 Unauthorized }
- __Update : Put sessions/:label__
    - admin, modo : { 204, No Content }, student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
    - _Bool open, String code, desc, label_
- __Delete : Delete sessions/:label__
    - admin : { 204, No Content }, modo, student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
- __Search : Get sessions__
    - admin, modo, student : { label, desc, open, result }, guest : { Error 401 Unauthorized }
    - _String string, Date date_
- __Export : Get sessions/:Label/csv__
    - admin, modo : [personality-1, ...personality-6] }, student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
- __Exports : Get sessions/cvs__
    - admin, modo : [date, label, personality-1, ...personality-6], student : { Error 403 Forbidden }, guest : { Error 401 Unauthorized }
    - _[String] labels_

### students
- __Create : Post sessions/:label/students__
    - guest : { 201, sessions/:label/students/:id }, other : { 403, Forbidden }
    - _String token, Object profile : percent, name_
- __Read : Get sessions/:label/students/:id__
    - student(:id) { result (if completed) }, guest : { 401, unauthorized }, other : { 403, Forbidden }
- __Delete : Delete sessions/:label/students/:id__
    - admin, modo, student : { 204, No Content }, guest : { 401, unauthorized }
- __Search : Get sessions/:label/students__
    - admin, modo : [{ result }], student : { Error 403 Forbidden }, guest : { Error 401, unauthorized }

## Immuable Ressources

### Responses
- __Read : Get lang/:lang/responses__
    - admin, modo, student { Object responses : label, text, point, profile }, guest { 403, Unauthorized }
- __Update : Put lang/:lang/response/:label__
    - admin { 204, No Content }, modo, student { 403, Forbidden }, guest { 403, Unauthorized }
    - _String text_

### Profile
- __Read : Get lang/:lang/profiles__
    - admin, modo, student { Object profile : name, desc }, guest { 403, Unauthorized }
- __Update : Put lang/:lang/profile/:label__
    - admin { 204, No Content }, modo, student { 403, Forbidden }, guest { 403, Unauthorized }
    - _String name, desc_
