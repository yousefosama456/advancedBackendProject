module.exports=fn =>(req,res,next)=>{
    fn(req,res,next).catch(next) // like catch (err=>next(err))
}