/*
Licensed under the MIT license.
http://www.opensource.org/licenses/mit-license.php
this file is part of HTMoL:
Copyright (C) 2014  Alvarez Rivera Leonardo,Becerra Toledo Francisco Javier, Vega Ramirez Adan
*/
var zoom,data,MainMenu;
var worker1;
var sizeglob=0;
var url;
var totalframes=0;
var totalframes1=0;
var numframe=0;
var trjbnd=false;
var bitrate=0;
var readstart=0; 
var readend=4999999;
var requireddata=false;
var pos=0;
var bndarray=true;
var bndbuffer=0;
var bndfinal=false;
var bndknowframe=false;
var bndreview=false;
var sizearrayp=0;
var trjauto=false;
var autoplay=true;
var fpath;

function Main()
{
	//-----------------------------------Bloque inicial para declarar el worker----------------------------------
	if (typeof(Worker)=="undefined")
	{
        alert("Workers no soportados");
    } 
    else 
    {
        //Para modificar worker1.js y evitar caché
        var marcaTime = parseInt(Math.random() * 1000000);
        worker1 = new Worker("js/worker.js?=" + marcaTime);
        worker1.postMessage = worker1.webkitPostMessage || worker1.postMessage;
        worker1.onerror= function(e){
        	data.innerHTML=e.message;
        } 
        worker1.addEventListener("message", manejadorEventoWorker1, false);
    }
    //----------------------------------------------------------------------------------------------------------------
    var main=this;
	this.ObjP= new Process();
	//--------------------------Este bloque se va a crear en una función ya que aquí se lee el archivo pdb con la ruta dada-------------------
	molecule=this.ObjP.ReadFile("1crn.pdb");
	createBonds(this);	

    //--------------------------------------------------------------------------------------------------------------------------------------------------

    AtomosSeleccionados=molecule.LstAtoms;

	//this.Obj3D= new THREED(ObjRepresentation,main,main.ObjP);

    var Container=null;
    var buffer = new ArrayBuffer();



	this.Model= function(url)
	{
	    return function(event){
	   	try{
	   		//alert("deleteModel");
	   	main.DeleteModel();
	    main.MakeModel(url);   
		}catch(e)
		{
			data.innerHTML='Error: Invalid URL or Connection not available';
		}
	   }
	}

	this.DeleteButtons = function()
	{
		for(var i=0; i<LstBtnsChain.length;i++)
		{
			menu.removeChild(LstBtnsChain[i]);
		}
		

	}


	this.Buttons=function()
	{
		LstBtnsChain=[];
		for(var i=0; i<molecule.LstChain.length; i++)
		{
			var chain = molecule.LstChain[i];
			var button = document.createElement('input');
			button.type="button";
			button.value=chain.Name;
			button.id=chain.Name;
			button.onclick=ProcesarCadena(i,button);
			if (button.value!="undefined") 
			{
				menu.appendChild(button);
				LstBtnsChain.push(button);
			}

		}

	}

		
	this.MakeModel=function(url)
	{
	   molecule=main.ObjP.ReadFile(url);	
	    
	   createBonds(main);

	   initBuffers();

	   if(molecule!=null)
	   {
	   	   data.innerHTML="Loading...";
		  
		   if(main.ObjP.Model.Frames!=0 && main.ObjP.Model.Frames!="")
		   {
		   main.filerequest();	
		   console.log(trjauto);	   
		   trjauto=true;
		   autoplay=false;
		   console.log(trjauto);
			}
		   data.innerHTML="";
	   }
	   else{
	   	data.innerHTML='Error: Iccnvalid URL or Connection not available';
	   }
	}

	this.Parse=function(txt)
	{
		/*
		elementos separados por coma  o un guión   

		aquí entra el texto para el cuál se realiza el análisis
		space	=
		; 		=
		-		=
		enter	= 13

		Puedo hacer un array por cada palabra separada por un space ,  ; 
		

		obtener la primer palabra que va a ser el comando a usar
		
		var firstWords = [];
		for (var i=0;i<codelines.length;i++)
		{
		  var codeLine = codelines[i];
		  var firstWord = codeLine.substr(0, codeLine.indexOf(" "));
		  firstWords.push(firstWord);
		}

		*/
		var comando=txt.substr(0, txt.indexOf(" "));//obtengo la primer palabra que es un comando 
		//luego voy a obtener todo lo demás 
		var lines=txt.split(" ");
		var inst=txt.replace(comando + ' ','');

		if (comando=='select') 
		{
			//alert("comando select");
			//obtener todo lo demás antes del ;
			//alert(inst);
			//alert(inst.length);		
			var numAtoms=0;
			var regex = /(\d+)/g;
			//alert(inst.match(regex));
			//alert(AtomosSeleccionados.length);

			if (inst=='all') 
			{
				AtomosSeleccionados=molecule.LstAtoms;
			}
			else
			{
				script=inst.match(regex);
				for(var o in script)
		        {
		            if(o==0)
		            {
		                AtomosSeleccionados=molecule.LstChain[0].LstAminoAcid[script[0]-1].GetAtoms();
		            }
		            else
		            {
		                 AtomosSeleccionados=AtomosSeleccionados.concat(molecule.LstChain[0].LstAminoAcid[script[o]-1].GetAtoms());
		            }		            
		        }




		        for(var t=0; t<AtomosSeleccionados.length; t++)
		            {
		            	var atom=AtomosSeleccionados[t];
		            	if (atom.Seleccionado==false) 
		            	{
		            		//
		            		atom.Seleccionado=true;
                            haySeleccionado=true;

                            if (NBW==0)  //es el primero que voy a agregar al objeto Solid
                            {
                                NBW=1;
                                LstBW[0]=new Array();
                            }
                            else
                            {
                                //---------------agregarlo a la cola en el wire
                                if (LstBW[NBW-1].length==NoPaso ) 
                                {
                                    NBW+=1;   
                                    LstBW[NBW-1]=new Array(); 
                                    wirePositionData[NBW-1]=new Array();
                                    wirenormalDataN[NBW-1]=new Array();
                                    wireColorTotal[NBW-1]=new Array();
                                    wireindexData[NBW-1]=new Array();

                                    ChainIndexW[NBW - 1] = new Array();

                                    sphereWirePositionBuffer[NBW-1]=new Array();
                                    sphereWireColorBuffer[NBW-1]=new Array();
                                    sphereWireIndexBuffer[NBW-1]=new Array();
                                    sphereWireNormalBuffer[NBW-1]=new Array();

                                    ChainBufferW[NBW - 1] = new Array();
                                }

                            }
                            LstBW[NBW-1].push(atom);                            
                            atom.BloqueWire=NBW;                            
                            atom.PositionBWire=LstBW[NBW-1].length;

                             /////////////////////////////////////////////////// VERTICES    //////////////////////////////////////////
                            if (atom.Representation=="SB") 
                            {
                                for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                                {        
                                    wirePositionData[NBW-1].push(verArray[z]     + atom.X -Cx);
                                    wirePositionData[NBW-1].push(verArray[z+1]   + atom.Y -Cy);
                                    wirePositionData[NBW-1].push(verArray[z+2]   + atom.Z -Cz);

                                    wirenormalDataN[NBW-1].push(normalData[z]    );
                                    wirenormalDataN[NBW-1].push(normalData[z+1]   );
                                    wirenormalDataN[NBW-1].push(normalData[z+2]   );

                                    z=z+3;
                                }

                            }
                            else if(atom.Representation=="CPK")
                            {
                                //alert(89999);
                                if (atom.NameAtom=='H') 
                                {
                                    for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                                    {        
                                        wirePositionData[NBW-1].push(verArrayH[z]     + atom.X -Cx);
                                        wirePositionData[NBW-1].push(verArrayH[z+1]   + atom.Y -Cy);
                                        wirePositionData[NBW-1].push(verArrayH[z+2]   + atom.Z -Cz);

                                        wirenormalDataN[NBW-1].push(normalData[z]    );
                                        wirenormalDataN[NBW-1].push(normalData[z+1]   );
                                        wirenormalDataN[NBW-1].push(normalData[z+2]   );

                                        z=z+3;
                                    }
                                }
                                else if (atom.NameAtom=='C') 
                                {
                                    for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                                    {        
                                        wirePositionData[NBW-1].push(verArrayC_PB_TI_CA[z]     + atom.X -Cx);
                                        wirePositionData[NBW-1].push(verArrayC_PB_TI_CA[z+1]   + atom.Y -Cy);
                                        wirePositionData[NBW-1].push(verArrayC_PB_TI_CA[z+2]   + atom.Z -Cz);

                                        wirenormalDataN[NBW-1].push(normalData[z]    );
                                        wirenormalDataN[NBW-1].push(normalData[z+1]   );
                                        wirenormalDataN[NBW-1].push(normalData[z+2]   );

                                        z=z+3;
                                    }


                                }
                                else /////////// DEFAULT
                                {
                                    for (var z=0; z<nVertices;) //vertices para esfera de 16 latitudes y longitudes
                                    {        
                                        wirePositionData[NBW-1].push(verArrayC_PB_TI_CA[z]     + atom.X -Cx);
                                        wirePositionData[NBW-1].push(verArrayC_PB_TI_CA[z+1]   + atom.Y -Cy);
                                        wirePositionData[NBW-1].push(verArrayC_PB_TI_CA[z+2]   + atom.Z -Cz);

                                        wirenormalDataN[NBW-1].push(normalData[z]    );
                                        wirenormalDataN[NBW-1].push(normalData[z+1]   );
                                        wirenormalDataN[NBW-1].push(normalData[z+2]   );

                                        z=z+3;
                                    }

                                }


                            }
                            else
                            {

                            }

                            ////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            
                            //alert(99);                         
                            for(var i=0; i<nColor;)
                            {
                                wireColorTotal[NBW-1].push(atom.ColorRGB[0]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[1]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[2]);
                                wireColorTotal[NBW-1].push(atom.ColorRGB[3]);
                                i=i+4;

                                ChainIndexW[NBW - 1].push(atom.idChain);
                                ChainIndexW[NBW - 1].push(atom.idChain);
                            }
                            //alert(nIndices);
                            for(var i=0; i<nIndices;i++)
                            {
                                //tengo que saber en qué posicion se encuentra
                                wireindexData[NBW-1].push(indicesSphere[i]  +   ( 289 * (LstBW[NBW-1].length-1)) );
                            }
                            //alert(44);                            
                            sphereWirePositionBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirePositionData[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWirePositionBuffer[NBW-1].itemSize = 3;
                            sphereWirePositionBuffer[NBW-1].numItems = (wirePositionData[NBW-1].length / 3) * 1;
                            //alert(54);
                            sphereWireColorBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER,sphereWireColorBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wireColorTotal[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireColorBuffer[NBW-1].itemSize = 4;
                            sphereWireColorBuffer[NBW-1].numItems = (wireColorTotal[NBW-1].length / 4) * 1;
                            //alert(64);

                            ChainBufferW[NBW - 1] = gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, ChainBufferW[NBW - 1]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndexW[NBW - 1]), gl.DYNAMIC_DRAW);
                            ChainBufferW[NBW - 1].itemSize = 2;
                            ChainBufferW[NBW - 1].numItems = (ChainIndexW[NBW - 1].length / 2) * 1;

                            sphereWireIndexBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereWireIndexBuffer[NBW-1]);
                            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(wireindexData[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireIndexBuffer[NBW-1].itemSize = 1;
                            sphereWireIndexBuffer[NBW-1].numItems = (wireindexData[NBW-1].length / 1) * 1;
                            
                            sphereWireNormalBuffer[NBW-1]=gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireNormalBuffer[NBW-1]);
                            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirenormalDataN[NBW-1]), gl.DYNAMIC_DRAW);
                            sphereWireNormalBuffer[NBW-1].itemSize = 3;
                            sphereWireNormalBuffer[NBW-1].numItems = (wirenormalDataN[NBW-1].length / 3) * 1; 

                            ///////////////////---------------Quitar el átomo del ObjetoSolid ///////////////////////////////////////////////////////

                            //////////--------------el atomo seleccionado es el último del objeto Solido-----------------//////////
                            if (atom.BloqueSolid==NBS  &&  atom.PositionBSolid==LstBS[NBS-1].length ) //mandar la alerta para checar si esto está bien
                            { //las posiciones van desde 0, 
                                //quitar el atom solid
                                //alert("el atomo seleccionado es el ultimo del objeto solido");
                                vertexPositionData[NBS-1].splice( (atom.PositionBSolid-1)*nVertices,nVertices);
                                normalDataN[NBS-1].splice( (atom.PositionBSolid-1)*nVertices,nVertices);
                                ColorTotal[NBS-1].splice( (atom.PositionBSolid-1)*nColor,nColor);
                                indexData[NBS-1].splice((atom.PositionBSolid-1)*nIndices,nIndices);
                                ChainIndex[NBS - 1].splice((atom.PositionBSolid - 1) * nChain, nChain);


                                LstBS[NBS-1].pop() //se quita el atom del solid
                                if (LstBS[NBS-1].length==0) //quiere decir que era el único átomo que había en todo el bloque solid
                                {
                                    NBS-=1;
                                }
                                else
                                {
                                    //solo se imprime si no se eliminó un bloque, ya que si se eliminó un bloque no se va a imprimir en la tarjeta gráfica
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                    sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[NBS - 1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[NBS - 1]), gl.DYNAMIC_DRAW);
                                    ChainBuffer[NBS - 1].itemSize = 2;
                                    ChainBuffer[NBS - 1].numItems = (ChainIndex[NBS - 1].length / 2) * 1;

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                    sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;
                                }

                            }
                            //////////--------------el atomo seleccionado no es el último el los bloques Solid-----------------//////////
                            else
                            {   
                                //alert("el atomo seleccionado no es el ultimo del objeto solido");                                                          
                                //voy a eliminar este atom y además voy a agregar el que está en la cola del solid a esta posición
                                for(var i=0; i<nVertices;i++)
                                {
                                    vertexPositionData[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nVertices)+i, 1, vertexPositionData[NBS-1][vertexPositionData[NBS-1].length - nVertices + i ] );
                                    normalDataN[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nVertices)+i,        1, normalDataN[NBS-1][normalDataN[NBS-1].length - nVertices + i ] );     
                                }                                
                                for(var i=0; i<nColor;i++)
                                {
                                    ColorTotal[atom.BloqueSolid-1].splice( ((atom.PositionBSolid-1)*nColor)+i,            1, ColorTotal[NBS-1][ColorTotal[NBS-1].length - nColor + i ] );  
                                }

                                for (var i = 0; i < nChain; i++) 
                                {
                                    ChainIndex[atom.BloqueSolid - 1].splice(((atom.PositionBSolid - 1) * nChain) + i, 1, ChainIndex[NBS - 1][ChainIndex[NBS - 1].length - nChain + i]);
                                } 

                                                              
                                //los índices sólo quito los indices últimos del último bloque
                                indexData[NBS-1].splice( indexData[NBS-1].length - nIndices ,nIndices);

                                //ahora eliminar el que tenía en la cola
                                vertexPositionData[NBS-1].splice(vertexPositionData[NBS-1].length - nVertices,nVertices);
                                normalDataN[NBS-1].splice(normalDataN[NBS-1].length - nVertices,nVertices);
                                ColorTotal[NBS-1].splice(ColorTotal[NBS-1].length - nColor,nColor);
                                ChainIndex[NBS - 1].splice(ChainIndex[NBS - 1].length - nChain, nChain);

                                LstBS[NBS-1][ LstBS[NBS-1].length-1 ].BloqueSolid=atom.BloqueSolid;
                                LstBS[NBS-1][ LstBS[NBS-1].length-1 ].PositionBSolid=atom.PositionBSolid;
                                LstBS[atom.BloqueSolid-1].splice( atom.PositionBSolid-1, 1, LstBS[NBS-1][LstBS[NBS-1].length-1] ) //se quita el atom del solid y se agrega el de la cola
                                LstBS[NBS-1].pop();
                                //alert(98888);
                                
                                if (atom.BloqueSolid==NBS) 
                                {
                                    //alert("wss");
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                    sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[NBS - 1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[NBS - 1]), gl.DYNAMIC_DRAW);
                                    ChainBuffer[NBS - 1].itemSize = 2;
                                    ChainBuffer[NBS - 1].numItems = (ChainIndex[NBS - 1].length / 2) * 1;

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                    sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                }
                                else
                                {
                                    //alert("yyyyy");
                                    //quiere decir que son dos bloques los que voy a procesar
                                    if (LstBS[NBS-1].length==0) 
                                    {
                                        //alert(88);
                                    }
                                    else
                                    {
                                        //alert(99);
                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexPositionBuffer[NBS-1].itemSize = 3;
                                        sphereVertexPositionBuffer[NBS-1].numItems = (vertexPositionData[NBS-1].length / 3) * 1;

                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexColorBuffer[NBS-1].itemSize = 4;
                                        sphereVertexColorBuffer[NBS-1].numItems = ColorTotal[NBS-1].length/4;
                                        gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                        gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[NBS - 1]);
	                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[NBS - 1]), gl.DYNAMIC_DRAW);
	                                    ChainBuffer[NBS - 1].itemSize = 2;
	                                    ChainBuffer[NBS - 1].numItems = (ChainIndex[NBS - 1].length / 2) * 1;

                                        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[NBS-1]);
                                        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexIndexBuffer[NBS-1].itemSize = 1;
                                        sphereVertexIndexBuffer[NBS-1].numItems = indexData[NBS-1].length;

                                        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[NBS-1]);
                                        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[NBS-1]), gl.DYNAMIC_DRAW);
                                        sphereVertexNormalBuffer[NBS-1].itemSize = 3;
                                        sphereVertexNormalBuffer[NBS-1].numItems = normalDataN[NBS-1].length/3;
                                        //alert(100);

                                    }
                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexPositionBuffer[atom.BloqueSolid-1].itemSize = 3;
                                    sphereVertexPositionBuffer[atom.BloqueSolid-1].numItems = (vertexPositionData[atom.BloqueSolid-1].length / 3) * 1;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexColorBuffer[atom.BloqueSolid-1].itemSize = 4;
                                    sphereVertexColorBuffer[atom.BloqueSolid-1].numItems = ColorTotal[atom.BloqueSolid-1].length/4;
                                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

                                    gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[atom.BloqueSolid - 1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[atom.BloqueSolid - 1]), gl.DYNAMIC_DRAW);
                                    ChainBuffer[atom.BloqueSolid - 1].itemSize = 2;
                                    ChainBuffer[atom.BloqueSolid - 1].numItems = (ChainIndex[atom.BloqueSolid - 1].length / 2) * 1;

                                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexIndexBuffer[atom.BloqueSolid-1].itemSize = 1;
                                    sphereVertexIndexBuffer[atom.BloqueSolid-1].numItems = indexData[atom.BloqueSolid-1].length;

                                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[atom.BloqueSolid-1]);
                                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[atom.BloqueSolid-1]), gl.DYNAMIC_DRAW);
                                    sphereVertexNormalBuffer[atom.BloqueSolid-1].itemSize = 3;
                                    sphereVertexNormalBuffer[atom.BloqueSolid-1].numItems = normalDataN[atom.BloqueSolid-1].length/3;
                                    //alert(101);
                                }

                                if (LstBS[NBS-1].length==0) 
                                {
                                    NBS-=1;
                                }   

                            }                             


		            	}
		            	else
		            	{
		            		//No hacer nada xq ya está seleccionado

		            	}

		            }





			}	

			//alert(AtomosSeleccionados.length);		
	        document.getElementById("Console_output").value='selected atoms: ' + AtomosSeleccionados.length;
		}
		else if (comando=='color') 
		{
			//alert("comando color");
			var color=inst;
			for(var o in AtomosSeleccionados) //son los objetos seleccionados 
            {
            	/*
                var ato=AtomosSeleccionados[o];


                ato.Color=LstColors[inst].color;
                //alert(ato.Color);
                ato.Mesh.material.color.setHex(ato.Color);
                */
            }

		}
		else if (comando=='show') 
		{
			if (inst=='sequence') //para el show sequence
			{
				var sqnc='';
				for(var o in molecule.LstChain) //son los objetos seleccionados  main.oRepresentation.molecule
            	{
            		var chain=molecule.LstChain[o];
            		for(var v in chain.LstAminoAcid) //son los objetos seleccionados  main.oRepresentation.molecule
	            	{
	            		if (v==0) 
	            		{
	            			sqnc=chain.LstAminoAcid[v].Name + chain.LstAminoAcid[v].Number;

	            		}
	            		else
	            		{
	            			sqnc=sqnc + ', ' + chain.LstAminoAcid[v].Name + chain.LstAminoAcid[v].Number;
	            		}            		

	            	}

            	}
            	document.getElementById("Console_output").value=sqnc;
			}
			else if(inst=='cpk') //para mostrar el cpk
			{
				main.oRepresentation.repre='CPK';
                main.oRepresentation.Make(main.o3D);
			}
			else if(inst=='sb') //para mostrar el cpk
			{
				main.oRepresentation.repre='SB';
                main.oRepresentation.Make(main.o3D);
			}
			else if(inst=='bonds') //para mostrar el cpk
			{
				main.oRepresentation.repre='Bonds';
                main.oRepresentation.Make(main.o3D);
			}
			else if(inst=='skeleton') //para mostrar el cpk
			{
				main.oRepresentation.repre='Skeleton';
                main.oRepresentation.Make(main.o3D);
			}
			else
			{
				document.getElementById("Console_output").value='Unknown command';	
			}


		}
		else
		{
			document.getElementById("Console_output").value='Unknown command';
		}

	}

	this.onTestChange=function(event) 
	{
	    var key =  event.which || event.keyCode; //se ponen los dos porque en firefox no sirve keycode
	    // If the user has pressed enter
	    if (key == 13) {
	    	event.preventDefault(); //esta línea es para que no se imprima una nueva línea con el enter
	    	main.Parse(document.getElementById("Console_input").value.toLowerCase());
	    	document.getElementById("Console_input").value='';    	
	        //document.getElementById("Console_input").value =document.getElementById("Console_input").value + "\n*";
	        return false;
	    }
	    else {
	        return true;
	    }
	}

	this.DeleteModel=function()
	{
		/*
		main.ObjP.representation.CPK.Delete(main.Obj3D.scene);
		main.ObjP.representation.SpheresBonds.Delete(main.Obj3D.scene);
		main.ObjP.representation.Skeleton.Delete(main.Obj3D.scene);
		main.ObjP.representation.Bonds.Delete(main.Obj3D.scene);
		main.Obj3D.DeleteMarkers();
		main.Obj3D.DeleteMeasures();
		main.Obj3D.DeleteButtons();
		*/
	}



	this.MakeMenu=function(container)
	{
		var hope="<link rel='stylesheet' type='text/css' href='styles/component.css' />"
				+"<link rel='stylesheet' type='text/css' href='styles/Styles.css' />"
				+"	<div id='Menus'>"
				+"	<div id='zoom'></div>"
				+"	<div id='menu'></div>"
				+"	</div>"
				+"	<div id='MainMenu'>"
				+"		<div id='dl-menu' class='dl-menuwrapper'>"
				+"		<button class='dl-trigger'>Open Menu</button>"
				+" 		<ul class='dl-menu'>"
				+"		<li><a href='#'>Open</a>"
				+"		<UL  id='Molecule' class='dl-submenu'></UL>"
				+"			</li><li><a href='#'>Select</a>"
				+"			<ul class='dl-submenu'>"
				+"				<li><a href='#'>Aminoacid</a>"
				+"		   <ul id='sub-Amin' class='dl-submenu'>"
				+"			   <li><a href='#' id='ALA'>ALA</a></li>" 
				+"			   <li><a href='#' id='ARG'>ARG</a></li>" 
				+"			   <li><a href='#' id='ASN'>ASN</a></li>" 
				+"			   <li><a href='#' id='ASP'>ASP</a></li>" 
				+"			   <li><a href='#' id='CYS'>CYS</a></li>" 
				+"			   <li><a href='#' id='GLN'>GLN</a></li>" 
				+"			   <li><a href='#' id='GLU'>GLU</a></li>" 
				+"			   <li><a href='#' id='GLY'>GLY</a></li>" 
				+"			   <li><a href='#' id='HIS'>HIS</a></li>" 
				+"			   <li><a href='#' id='ILE'>ILE</a></li>"
				+"			   <li><a href='#' id='LEU'>LEU</a></li>" 
				+"			   <li><a href='#' id='LYS'>LYS</a></li>" 
				+"			   <li><a href='#' id='MET'>MET</a></li>" 
				+"			   <li><a href='#' id='PHE'>PHE</a></li>" 
				+"			   <li><a href='#' id='PRO'>PRO</a></li>" 
				+"			   <li><a href='#' id='SER'>SER</a></li>" 
				+"			   <li><a href='#' id='THR'>THR</a></li>" 
				+"			   <li><a href='#' id='TRP'>TRP</a></li>" 
				+"			   <li><a href='#' id='TYR'>TYR</a></li>" 
				+"			   <li><a href='#' id='VAL'>VAL</a></li>" 
				+"		   </ul>" 
				+"	   </li>" 
				+"	   <li>" 
				+"	   <a href='#'>Atom</a>" 
				+"	   <ul id='sub-Atom' class='dl-submenu'>" 
				+"		   <li><a href='#' id='C'>C</a></li>" 
				+"		   <li><a href='#' id='H'>H</a></li>" 
				+"		   <li><a href='#' id='O'>0</a></li>" 
				+"		   <li><a href='#' id='PB'>PB</a></li>" 
				+"		   <li><a href='#' id='TI'>TI</a></li>" 
				+"		   <li><a href='#' id='N'>N</a></li>" 
				+"		   <li><a href='#' id='S'>S</a></li>" 
				+"		   <li><a href='#' id='P'>P</a></li>" 
				+"	   </ul> </li> <li> <a href='#'>Color</a>" 
				+"	   <ul id='sub-color'class='dl-submenu'>" 
				+"		   <li><a href='#' id='yellow'>Yellow</a></li>" 
				+"		   <li><a href='#' id='red'>Red</a></li>" 
				+"		   <li><a href='#' id='orange'>Orange</a></li>" 
				+"		   <li><a href='#' id='blue'>Blue</a></li>" 
				+"		   <li><a href='#' id='bluesky'>Blue Sky</a></li>" 
				+"		   <li><a href='#' id='green'>Green</a></li>" 
				+"		   <li><a href='#' id='purple'>Purple</a></li>" 
				+"		   <li><a href='#' id='pink'>Pink</a></li>" 
				+"		   <li><a href='#' id='gray'>Gray</a></li>" 
				+"		   <li><a href='#' id='brown'>Brown</a></li>" 
				+"		   <li><a href='#' id='DefaultColor'>Default</a></li>" 
				+"	   </ul> </li>" 
				+"	   <li><a href='#' id='All'>All</a></li>" 
				+"	   <li><a href='#' id='Show'>Show</a></li> </ul> </li>" 
				+"	   <li><a href='#'>Actions</a>" 
				+"	   <ul class='dl-submenu'>" 
				+"	   <li><a href='#'>View</a>" 
				+"	   <ul class='dl-submenu'>" 
				+"	   <li><a href='#' id='F'>Front</a></li>" 
				+"	   <li><a href='#' id='L'>Left</a></li>" 
				+"	   <li><a href='#' id='R'>Right</a></li>" 
				+"	   <li><a href='#' id='U'>Up</a></li>" 
				+"	   <li><a href='#' id='D'>Down</a></li>" 
				+"	   <li><a href='#' id='B'>Back</a></li> </ul> </li>" 
				+"	   <li><a href='#'>Markers</a> <ul class='dl-submenu'>" 
				+"	   <li><a href='#' id='ShowMarkers'>Show Markers</a></li>" 
				+"	   <li><a href='#' id='HideMarkers'>Hide Markers</a></li>" 
				+"	   <li><a href='#' id='DeleteMarkers'>Delete Markers</a></li>"
				+"	    </ul> </li> <li><a title='Atom Select' href='#'>A.Selected</a>" 
				+"	    <ul class='dl-submenu'>" 
				+"	    <li><a href='#' id='NameAtom'>Name Atom</a></li>" 
				+"	    <li><a href='#' id='NumberAtom'>Number Atom</a></li>" 
				+"	    <li><a href='#' id='DetailsAtom'>Details Atom</a></li>" 
				+"	    <li><a href='#' id='Center'>Center Atom</a></li>"
				+"	    <li><a href='#' id='Identify'>Identify</a></li>" 
				+"	    <li><a href='#' id='None1'>None</a></li> </ul> </li>" 
				+"	    <li><a href='#'>Measures</a> <ul class='dl-submenu'>" 
				+"	    <li><a href='#' id='Distance'>Distance</a></li>" 
				+"	    <li><a href='#' id='Angle'>Angle</a></li>" 
				+"	    <li><a href='#' id='None2'>None</a></li>" 
				+"	    <li><a href='#' id='DeleteMeasures'>Delete Measures</a></li>" 
				+"	    </ul> </li>" 
				+"	    <li><a href='#'  title='Helix and Sheet' id='ViewHS'>H & S</a></li>" 
				+"	    <li><a href='#' id='Axis'>Axis</a></li>"
				+"	    <li><a href='#' title='Molecule Center' id='MoleculeCenter'>M.Center</a></li>"
				+"	    </ul></li>"
				+"	    <li><a href='#'>Representations</a>" 
				+"	    <ul class='dl-submenu'>" 
				+"	    <li><a href='#' id='CPK'>CPK</a></li>" 
				+"	    <li><a href='#' id='Bonds'>Bonds</a></li>" 
				+"	    <li><a href='#' title='Spheres Bonds' id='Spheres Bonds'>S.Bonds</a></li>" 
				+"	    <li><a href='#' id='Skeleton'>Skeleton</a></li> </ul> </li> </ul> </div></div>"

		document.getElementById('WebGL-Out').innerHTML = hope; 
		var tagjs = document.createElement("script");       
      	tagjs.setAttribute("src", "fonts/optimer_regular.typeface.js");
      	document.getElementsByTagName("head")[0].appendChild(tagjs);
		Container=container;
		//Container.onmouseover=function (){main.Obj3D.updatecontrols=true};
        //Container.onmouseout=function (){main.Obj3D.updatecontrols=false};
		var Menus = document.getElementById("Menus");
  		main.menu=document.getElementById("menu");
		var webgl = document.getElementById("WebGL-Out");
  		MainMenu = document.getElementById('div');
  		data = document.getElementById("data");
  		zoom = document.getElementById("zoom");

  		//Botones para las representaciones
  		var buttonOp = document.getElementById( "CPK" ); 
	    buttonOp.onclick=R_Cpk();
	      
	    buttonOp = document.getElementById( "Spheres Bonds" );
	    buttonOp.onclick=R_SB();

	    buttonOp = document.getElementById( "Bonds" );
	    buttonOp.onclick=R_B();

		
  		
        if(typeof(URLS) != "undefined")
        { 
        	for(var i in URLS)
			{		
			   	var button = document.getElementById( "Molecule" ); 
		       	button.innerHTML+='<li><a href="#" id="new"></a></li>';	

		       	button = document.getElementById("new"); 
		       	button.id=URLS[i].name;
		       	button.innerHTML=URLS[i].name;
			}
		  
        }
		else
		{ 
			URLS = null;
		}

	    var button = document.getElementById( "Molecule" ); 
        button.innerHTML+='<li><a href="#" id="ByURL">By URL</a></li>';
        button.innerHTML+='<li><a href="#" id="trajauto">Auto trajectory</a></li>';
        button.innerHTML+='<li><a href="#" id="loadtraj">Load trajectory</a></li>';
        button = document.getElementById( "ByURL" ); 
        button.onclick=this.ScenebyURL();

        
        var buttontraj = document.getElementById( "loadtraj" ); 
        buttontraj.onclick=this.ScenebyTrajectory();

        var buttontrj = document.getElementById( "trajauto" ); 
        buttontrj.onclick=function()
        {
        	main.DeleteButtons()
        	url="http://127.0.0.1:25565/test/prueba.pdb";
        	main.MakeModel(url);
        	main.Buttons();
        }

        main.Buttons();
      /*
        for(var i in URLS)
	    {		
	    	var button = document.getElementById( URLS[i].name ); 
        	button.onclick=this.Model(URLS[i].url);
	    }
		
		var o=0;
	    
	    if(typeof(URLS) != "undefined")
        { 
		    for(var i in URLS)
		    {
			    if (o==0) 
			    {
			    	main.DeleteModel();
					main.MakeModel(URLS[i].url);
				}
				o++;
			}
		}*/

	    //main.Obj3D.Rendering(webgl); 

	}

	this.Scene=function(url)
	{
	    return function(event)
	    {
	    main.Model(url);
	    }
	}
	
	this.ScenebyURL=function()
	{
        return function(event)
        {
        	//se coloca la ip del servidor y el puerto que se abrió
        	url = prompt("URL: ", "http://127.0.0.1:25565/test/2vep_md_prot.pdb");
		    if(url!='')
		    {
				if(url.length==4)
				url="http://www.rcsb.org/pdb/files/"+url+".pdb";
			    try
			    {
			    	main.MakeModel(url); 
			    }
			    catch(e)
				{
					data.innerHTML='Error: Invalid URL or Connection not available';
				}
		    }
		     
		}
	}

	this.trajreview=function()  //Esta función no se usa
	{	
		alert("help");	
		trjauto=true;
		bndknowframe=true;
		$('#loadtraj').click();		
	}

	this.ScenebyTrajectory=function()
	{
			return function(event)
        {
		    try{
		    	bndfinal=false;	
		    	main.filerequest();
		    }catch(e)
			{
				data.innerHTML='Error: Invalid file or Connection not available '.concat(e);
			}		     
		}
	}



	this.filerequest=function()
	{
	    trjbnd=false;
	    numframe=0;
		requireddata=false;
		totalframes=0;
		pos=0;
	    sizeglob=0;
		readend=20999999;
		readstart=0;
		bndbuffer=0;
		sizearrayp=0;
	    coordsX= new Float32Array();
		coordsX1=new Float32Array();
	    coordsY= new Float32Array();
		coordsY1=new Float32Array();	
	    coordsZ= new Float32Array();
		coordsZ1=new Float32Array();
	    bndreview = false;      
	    bitratespeed();  
	    var interval=setInterval(function(){
	    	if((sizeglob/molecule.GetAtoms().length)>0)
	    	{
	        	trjbnd=true;
		        var button=document.getElementById("playpause");
		        button.style.display="inline";
	          	clearInterval(interval);
	        }
	      },1000);
	      //main.Obj3D.getDataAtoms();
	}

	function bitratespeed()
	{
		var imageAddr = "speedtest.jpg" + "?n=" + Math.random() ;
		var startTime, endTime ;
		var downloadSize = 81877; 
		var download = new Image() ; 
		download.onload = function() { 
			endTime = (new Date()).getTime() ; 
			senddataworker(startTime,endTime,downloadSize) ;
		}
		startTime = (new Date()).getTime() ; 
		download.src = imageAddr ;
	}

	function senddataworker(startTime,endTime,downloadSize) 
	{
		var duration = Math.round((endTime - startTime) / 1000) ; 
		var bitsLoaded = downloadSize * 8 ;
		bitrate = Math.round(bitsLoaded / duration) ;
		if(!trjauto)															//en este bloque se asigna la trayectoria
		{
			fpath = window.prompt("enter path file","2vep_md_prot_fit.xtc");
		  	molecule.TrjPath=fpath;
		  	bndknowframe=false;
	   	}
	   	else
	   	{
		   	fpath=main.ObjP.Model.TrjPath;
		   	bndknowframe=true;
		   	trjauto=false;
		   	if(autoplay==false)
		   	{
			   	totalframes1=main.ObjP.Model.Frames;
			   	var button = document.getElementById("playpause");
			   	button.value = 'Play';
		    }
	    }
	   if(autoplay)
	    {
	  		data.innerHTML='Loading trajectory ... '
		}
	  	worker1.postMessage({cmd:"startfile",
	                       fpath:fpath,
	                       natoms:molecule.GetAtoms().length,
	                       bitrate:bitrate,
	                       readstart: readstart,
	                       readend:readend});
		var intervalreq= setInterval(function()
		{
			if(bndfinal==true)
			{
				console.log("ya lo borro");
				clearInterval(intervalreq);
			}
			else
			{
				if(parseInt(totalframes)==numframe && bndfinal==true)
				{
					//main.DeleteModel();
					//main.MakeModel(url);
					console.log("lo va a borrar");
					clearInterval(intervalreq);
				}
			    if(totalframes>200 && (totalframes-numframe)<=200 && requireddata==true)
			    {
			      	requireddata=false;
			      	sizearrayp=0;
			      	if(bndbuffer==1)
			      	{
				        coordsX = new Float32Array(sizearrayp);
				        coordsY = new Float32Array(sizearrayp);
				        coordsZ = new Float32Array(sizearrayp);
			      	}
			      	else
			      	{
				        coordsX1 = new Float32Array(sizearrayp);
				        coordsY1 = new Float32Array(sizearrayp);
				        coordsZ1 = new Float32Array(sizearrayp);
			      	}
			      	worker1.postMessage({cmd:"startfile",
			                            fpath:fpath, 
			                            natoms:molecule.GetAtoms().length,
			                            bitrate:bitrate,
			                            readstart: readstart,
			                            readend:readend});
			    }
		    }
	    },2000);
	} 

}

function handle_mousedown(e)
{
	alert("entra");
    window.my_dragging = {};
    my_dragging.pageX0 = e.pageX;
    my_dragging.pageY0 = e.pageY;
    my_dragging.elem = this;
    my_dragging.offset0 = $(this).offset();
    function handle_dragging(e){
        var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
        var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
        $(my_dragging.elem)
        .offset({top: top, left: left});
    }
    function handle_mouseup(e){
        $('body')
        .off('mousemove', handle_dragging)
        .off('mouseup', handle_mouseup);
    }
    $('body')
    .on('mouseup', handle_mouseup)
    .on('mousemove', handle_dragging);
}
$('Console').mousedown(handle_mousedown);




 $(function() {
    $( "#Console" ).draggable();
  });

/*
$(function ()
{
var main= new Main();
var container = document.getElementById("Contenedor");
//main.SetBackgroundColor(0xff0000);
main.MakeMenu(container);

});
*/