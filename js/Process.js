var contBonds=0;
var contBS=0;

var LstAtSelec=[];

function Aminoacid(number,name,state)
{
    this.Number=number;
    this.Name=name;
    this.State=state;
    this.LstAtoms=[];
    this.Type=null;
    
    this.GetAtoms=function()
    {
        return this.LstAtoms;
    }
}

function Chain(name,state)
{
    this.Name=name;
    this.State=state;
    this.LstAminoAcid=[];
    this.LstSkeleton=[];
    
    this.GetSkeleton=function()
    {
        return this.LstSkeleton;
    }
    
    this.GetAminoacid=function()
    {
        return this.LstAminoAcid;
    }    
}
function Bond()
{
   this.LstAtoms=[];
   this.id=0;
}

function BondSkeleton()
{
	this.id=0;
    this.LstAtoms=[];
}

function Molecule()
{
    this.Name='';
    this.LstChain=[];
    this.LstAtoms=[];
    this.LstBonds=[];
    this.LstBondsSkeleton=[];
    this.LstHelixAndSheet=[];
    this.CenterX=0;
    this.CenterY=0;
    this.CenterZ=0;
    this.Frames=0;
    this.TrjPath="";
    this.GetChain=function()
    {
        return this.LstChain;
    }
    
    this.GetBonds=function()
    {
        return this.LstBonds;
    }
    
    this.GetAtoms=function()
    {
        return this.LstAtoms;
    }
    
    this.GetBSkeleton=function()
    {
        return this.LstBondsSkeleton;
    }
    
}

function Atom(number,x,y,z,state,element,nameatom)
{   
    this.X=x;
    this.Y=y;
    this.Z=z;
    this.State=state;
    this.NumberAtom=number;
    this.Element=element;
    this.NameAtom=nameatom;
    this.Aminoacid=null;
    
    this.ColorName=null;
    this.ColorRGB=null;
    this.ColorRGBDiffuse=null;
    this.Seleccionado=false;
    this.Representation=null;

    this.LstidLinea=[];
    this.idLineaSkeleton;

    this.GetLstidLinea=function()
    {
        return this.LstidLinea;
    }
    //Esta parte es para los bloques
    this.BloqueWire=0;
    this.PositionBWire=0;
    this.BloqueSolid=0;
    this.PositionBSolid=0;
    ////////////////////////

    this.id=null; //es para poner el órden en el que aparecen
}

function createBonds(main)
	{
		var bond= new Bond();
	    for (var t in molecule.GetChain())
	    {
	        var chn=molecule.GetChain()[t];
	        for(var r in chn.GetAminoacid())
	        {
	            var amn=chn.GetAminoacid()[r];
	            for(var s in amn.GetAtoms())
	            {
	                var atom=amn.GetAtoms()[s];
	                for(var b in AtomsBonds[atom.NameAtom])
	                {
	                    var val=AtomsBonds[atom.NameAtom][b];
	                    for(var s in amn.GetAtoms())
	                    {
	                        var atomb=amn.GetAtoms()[s];
	                        if(val==atomb.NameAtom)
	                        {
	                            bond=main.ObjP.AddBond(bond,atom,atomb);
	                        }
	                    }
	                }
	            }
	        }
	    }
	}

function Process()
{
    this.Model= new Molecule();
    var cont=0;
	this.ReadFile= function(URL)
	{
		   var text = $.ajax({
		       url: URL, 
			   dataType: 'text',
			   async: false     
		   }).responseText;
		   if (text!=null&&text.substr(0,6)!="<html>"){
	        return this.Parse(text);
	    	}
	       else
	        return null;
	}
	   
	this.Parse= function(text)
	{

	   	this.Model=new Molecule();
	    var cmpAmino='',cmpChain='';
	    var chain=new Chain();
	    var aminoacid=new Aminoacid();
	    var bond=new Bond();
	    var bondS= new BondSkeleton();
	    var lines=text.split("\n");
	    var val,val2;
	    var AtomCount=0;
	    var contSkele=0;
	    var id=0;
	      
	    for(var i=0; i<lines.length; ++i)
	    {
	    	if(lines[i].substr(0,7)=="NFRAMES")
	    	{
	       		this.Model.Frames=lines[i].substr(10);
	       	}
	       	if(lines[i].substr(0,7)=="TRJPATH")
	       	{
	       		this.Model.TrjPath=lines[i].substr(10);
	       	}
		    if(lines[i].substr(0,6)=="HEADER")
		    {
				this.Model.Name=lines[i].substr(62,4);
		    }
		  
		    if(lines[i].substr(0,4)=="ATOM")
		    {
		   	    var atom=new Atom
		       	(
		       		lines[i].substr(6,5), 								//Number
		       		parseFloat(lines[i].substr(30,8)), 					//x
		       		parseFloat(lines[i].substr(38,8)), 					//y
		       		parseFloat(lines[i].substr(46,8)), 					//z
		       		'Active',											//state
		       		lines[i].substr(11,5).trim().substr(0,1),			//element
		       		lines[i].substr(11,6).trim().replace(/\s/g,"&")	 	//nombre
		       	);
			
           
				if(cont==0)
				{
					cmpAmino=lines[i].substr(22,4); //Número del aminoácido en el que aparece
					cmpChain=lines[i].substr(20,2);
					aminoacid=new Aminoacid(cmpAmino,lines[i].substr(17,3),'Active'); //THR o alguno de los 20
					chain=new Chain(cmpChain,'Active');
				}
				if(cmpAmino!=lines[i].substr(22,4)) //Número del aminoácido en el que apaarece
				{
					cmpAmino=lines[i].substr(22,4);
					chain.LstAminoAcid.push(aminoacid);
					aminoacid=new Aminoacid(cmpAmino,lines[i].substr(17,3),'Active');
				}
			    if(cmpChain!=lines[i].substr(20,2))
			    {
					cmpChain=lines[i].substr(20,2);
					this.Model.LstChain.push(chain);
					chain=new Chain(cmpChain,'Active');
				}		
		        aminoacid.LstAtoms.push(atom);	       
			    this.Model.LstAtoms.push(atom);

			    if(atom.NameAtom=='C'||atom.NameAtom=='O3\'')
			    {
			    	var atomtmp=atom;
			    }
		       		       		       
		        if((atom.NameAtom=='N'||atom.NameAtom=='P')&&cont>1)
		        {
		        	bond=this.AddBond(bond,atomtmp,atom);	
		        }

		        /////////////////////////// This part is for Skeletom´s Atoms ////////////////////////////////////////////
		       	if(atom.NameAtom=='CA'||atom.NameAtom=='P')
		       	{
		       		if (contSkele==0) {
		       			var atomtmp2=atom;
		       		}
					aminoacid.Type='T';
					atom.Aminoacid=aminoacid;
				    chain.LstSkeleton.push(atom);
				    if (contSkele>0) {
				    	bondS = this.AddBondSkeleton(bondS,atomtmp2,atom);
				    	atomtmp2.idLineaSkeleton=contBS-1; //checar el skeleton, ya que debería tener una o dos líneas cada átomo
		       			atom.idLineaSkeleton=contBS-1;
				    	atomtmp2=atom;
				    }
				    contSkele++;
		      	}
		      	///////////////////////////////////////////////////////////////////////////////////////////////////////////
		        
		        atom.Representation="SB";
		        this.Model.CenterX+=atom.X;
		        this.Model.CenterY+=atom.Y;
		        this.Model.CenterZ+=atom.Z;
		        cont++;	
		        /////////////////////////se añade al array
		        //alert(atom.NameAtom);
			   	//AtomArray.push(atom);
			   	////////////////////////
			   	id++;	
			   	atom.id=id;
			   		   	
		    }
		    
	    }
	    //alert('num atoms'+ this.Model.LstAtoms.length);

	    this.Model.CenterX=this.Model.CenterX/this.Model.LstAtoms.length;
		this.Model.CenterY=this.Model.CenterY/this.Model.LstAtoms.length;
		this.Model.CenterZ=this.Model.CenterZ/this.Model.LstAtoms.length
	    chain.LstAminoAcid.push(aminoacid);
	    this.Model.LstChain.push(chain);
	    return this.Model;
	}

	this.AddBond=function(bond,atom,union)
	{
		try
		{
		    var distancia=Math.sqrt(Math.pow(atom.X-union.X,2)+Math.pow(atom.Y-union.Y,2)+Math.pow(atom.Z-union.Z,2));
		    if(distancia<2)
		    {
			bond.LstAtoms.push(atom);
			bond.LstAtoms.push(union);
			bond.id=contBonds;
			atom.LstidLinea.push(contBonds);
			union.LstidLinea.push(contBonds);

			this.Model.LstBonds.push(bond);

			contBonds++;
		    }
		}catch(e)
		{}
	    return bond=new Bond();
	}

	this.AddBondSkeleton=function(bond,atom,union) 
	{
		try
		{
		    var distancia=Math.sqrt(Math.pow(atom.X-union.X,2)+Math.pow(atom.Y-union.Y,2)+Math.pow(atom.Z-union.Z,2));
		    if(distancia<8)
		    {
			bond.LstAtoms.push(atom);
			bond.LstAtoms.push(union);
			bond.id=contBS;
			atom.LstidLinea.push(contBS);
			union.LstidLinea.push(contBS);
			this.Model.LstBondsSkeleton.push(bond);
			contBS++;
		    }
		}catch(e)
		{}
	    return bond=new BondSkeleton();
	}

	  
}