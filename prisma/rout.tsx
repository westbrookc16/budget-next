import { PrismaClient } from "@prisma/client";
const get=(request,{params})=>{

 const prisma=new PrismaClient();
 const {month,year}=params;
 return prisma.budgets.findFirst({where:{month,year}});
}