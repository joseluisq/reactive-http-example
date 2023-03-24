import { Observable, catchError, of } from 'rxjs'
import { Http, HttpHandler, HttpInterceptor, HttpRequestDeduplicator } from 'reactive-http'

class MyInterceptor implements HttpInterceptor {
    intercept(req: Request, next: HttpHandler): Observable<Response> {
        console.log('my custom interceptor!')
        return next(req)
    }
}

interface Currency {
    symbol: string
    name: string
    symbol_native: string
    decimal_digits: number
    rounding: number
    iso_code: string
    name_plural: string
}

interface CurrencyMap {
    [key: string]: Currency,
}

const http = new Http()
http.intercept([new MyInterceptor(), new HttpRequestDeduplicator()])

const URL = 'https://raw.githubusercontent.com/joseluisq/json-datasets/master/json/currencies/currencies_symbols.json'
const event1$ = http.get<CurrencyMap>(URL)
const event2$ = http.get<CurrencyMap>(URL)
const event3$ = http.get<CurrencyMap>(URL)
// .pipe(
//     catchError(err => {
//         console.error(err)
//         return of({ error: false, message: err.message })
//     })
// )

function display(subscriber: number, currency: Currency) {
    console.log('==== Response for subscriber #' + subscriber)
    console.log('symbol:', currency.symbol)
    console.log('name:', currency.name)
    console.log('symbol_native:', currency.symbol_native)
    console.log('decimal_digits:', currency.decimal_digits)
    console.log('rounding:', currency.rounding)
    console.log('iso_code:', currency.iso_code)
    console.log('name_plural:', currency.name_plural)
}

event1$.subscribe(currencyMap => display(1, currencyMap['EUR']))
event2$.subscribe(currencyMap => display(2, currencyMap['USD']))
event3$.subscribe(currencyMap => display(3, currencyMap['CNY']))
