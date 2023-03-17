// import { catchError, of } from 'rxjs'
import { Observable } from 'rxjs'
import { Http, HttpHandler, HttpInterceptor } from 'reactive-http'

class Interceptor1 implements HttpInterceptor {
    intercept(req: Request, next: HttpHandler): Observable<Response> {
        console.log('first interceptor called!')
        return next(req)
    }
}

class Interceptor2 implements HttpInterceptor {
    intercept(req: Request, next: HttpHandler): Observable<Response> {
        console.log('second interceptor called!')
        return next(req)
    }
}

interface Repository {
    id: number
    full_name: string
    description: string
    html_url: string
    fork: boolean
}

const http$ = new Http()
http$.intercept(new Interceptor1())
http$.intercept(new Interceptor2())

const url = 'https://api.github.com/repos/joseluisq/reactive-http'
const resp$ = http$.get<Repository>(url)
// .pipe(
//     catchError(err => {
//         console.error(err)
//         return of({ error: false, message: err.message })
//     })
// )

resp$.subscribe(repo => {
    console.log('=== Github Repository API Response ===')
    console.log('Repo id:', repo.id)
    console.log('Repo name:', repo.full_name)
    console.log('Repo description:', repo.description)
    console.log('Repo url:', repo.html_url)
    console.log('Repo fork:', repo.fork)
})
