export interface Subscriber {

}
type Event = string
type Handler = (...args: any[]) => void
export function defineBus(){
  const subscribers: Map<Event, Handler[]> = new Map()

  return {
    on(event: Event, handler: Handler){
      if (!subscribers.get(event)){
        subscribers.set(event, [handler,])
      } else {
        subscribers.set(event, [...subscribers.get(event)!, handler,])
      }
    },
    off(){

    },
    emit(event: Event, ...data: any[]){
      const handlers = subscribers.get(event)
      if (Array.isArray(handlers)) {
        handlers.forEach((handler: Handler) => {
          handler(...data)
        })
      }
    },
  }
}
