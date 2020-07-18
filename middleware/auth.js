export default function ({store, redirect}){
    if (!store.getters['localStorage/isLoggedIn']){
        return redirect('/login')
    }
}