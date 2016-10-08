
	//var buttonOp;

function R_Cpk()
{
    return function(event)
    {
    	CambiarRepresentacion("Cpk");
    }
}

function R_SB()
{
    return function(event)
    {
	    CambiarRepresentacion("SB");
    }
}

function R_B()
{
    return function(event)
    {
	    CambiarRepresentacion("B");
    }
}

function ProcesarCadena(index,button)
{
	return function(event)
    {
    	if (molecule.LstChain[index].State=='Inactive') 
    	{
    		button.style.color=' #ffffff ';
    		molecule.LstChain[index].State='Active'

    		for(var i=0; i<molecule.LstChain[index].LstAminoAcid.length; i++ )
	    	{
	    		for(var j=0; j<molecule.LstChain[index].LstAminoAcid[i].LstAtoms.length; j++ )
	    		{
	    			var at= molecule.LstChain[index].LstAminoAcid[i].LstAtoms[j];
	    			//voy a checar cada uno para ver si está en wire o en solid
	    			//alert(ColorTotal[at.BloqueSolid-1]);
	    			//alert(at.NameAtom);
	    			var mul= (at.PositionBSolid - 1)*nColor;
	    			if (at.Seleccionado==false)  //entonces está en solid
	    			{
	    				//del bloque solid
	    				for(var k=0; k<nColor;)
	                    {
	                    	
	                        ColorTotal[at.BloqueSolid-1].splice(mul + k + 3, 1,  1); //el 0 es para hacerlo transparente
	                        
	                        k=k+4;
	                    }
	                    //alert(ColorTotal[at.BloqueSolid-1]);

	                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[at.BloqueSolid-1]);
	                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[at.BloqueSolid-1]), gl.DYNAMIC_DRAW);
	                    sphereVertexColorBuffer[at.BloqueSolid-1].itemSize = 4;
	                    sphereVertexColorBuffer[at.BloqueSolid-1].numItems = ColorTotal[at.BloqueSolid-1].length/4;
	                    gl.bindBuffer(gl.ARRAY_BUFFER, null);


	    			}
	    			else   //entonces está en el wire
	    			{
	    				//del bloque Wire
	    				for(var k=0; k<nColor;)
	                    {
	                    	
	                        wireColorTotal[at.BloqueWire-1].splice(mul + k + 3, 1,  1); //el 0 es para hacerlo transparente
	                        
	                        k=k+4;
	                    }
	                    //alert(ColorTotal[at.BloqueSolid-1]);

	                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireColorBuffer[at.BloqueWire-1]);
	                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wireColorTotal[at.BloqueWire-1]), gl.DYNAMIC_DRAW);
	                    sphereWireColorBuffer[at.BloqueWire-1].itemSize = 4;
	                    sphereWireColorBuffer[at.BloqueWire-1].numItems = wireColorTotal[at.BloqueWire-1].length/4;
	                    gl.bindBuffer(gl.ARRAY_BUFFER, null);


	    			}


	    		}

    	}
    	}
    	else
    	{
    		button.style.color=' rgb(255,0,0) ';
    		molecule.LstChain[index].State='Inactive'

    		for(var i=0; i<molecule.LstChain[index].LstAminoAcid.length; i++ )
	    	{
	    		for(var j=0; j<molecule.LstChain[index].LstAminoAcid[i].LstAtoms.length; j++ )
	    		{
	    			var at= molecule.LstChain[index].LstAminoAcid[i].LstAtoms[j];
	    			//voy a checar cada uno para ver si está en wire o en solid
	    			//alert(ColorTotal[at.BloqueSolid-1]);
	    			//alert(at.NameAtom);
	    			if (at.Seleccionado==false)  //entonces está en solid
	    			{
	    				var mul= (at.PositionBSolid - 1)*nColor;
	    				//quitarlo del bloque solid
	    				for(var k=0; k<nColor;)
	                    {
	                    	
	                        ColorTotal[at.BloqueSolid-1].splice(mul + k + 3, 1,  0); //el 0 es para hacerlo transparente

	                        
	                        k=k+4;
	                    }
	                    //alert(ColorTotal[at.BloqueSolid-1]);

	                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[at.BloqueSolid-1]);
	                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[at.BloqueSolid-1]), gl.DYNAMIC_DRAW);
	                    sphereVertexColorBuffer[at.BloqueSolid-1].itemSize = 4;
	                    sphereVertexColorBuffer[at.BloqueSolid-1].numItems = ColorTotal[at.BloqueSolid-1].length/4;
	                    gl.bindBuffer(gl.ARRAY_BUFFER, null);


	    			}
	    			else   //entonces está en el wire
	    			{
	    				//del bloque Wire
	    				for(var k=0; k<nColor;)
	                    {
	                    	
	                        wireColorTotal[at.BloqueWire-1].splice(mul + k + 3, 1,  0); //el 0 es para hacerlo transparente
	                        
	                        k=k+4;
	                    }
	                    //alert(ColorTotal[at.BloqueSolid-1]);

	                    gl.bindBuffer(gl.ARRAY_BUFFER, sphereWireColorBuffer[at.BloqueWire-1]);
	                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wireColorTotal[at.BloqueWire-1]), gl.DYNAMIC_DRAW);
	                    sphereWireColorBuffer[at.BloqueWire-1].itemSize = 4;
	                    sphereWireColorBuffer[at.BloqueWire-1].numItems = wireColorTotal[at.BloqueWire-1].length/4;
	                    gl.bindBuffer(gl.ARRAY_BUFFER, null);

	    			}


	    		}

	    	}
    	}
    	
    	
	    //alert("entra ProcesarCadena:"+index);
    }
}


function CambiarRepresentacion(Repre)   //Representacion es en lo que se va a cambiar
{
    if (Repre=='Cpk') 
    {
        for(var o in AtomosSeleccionados) //son los objetos seleccionados 
        {
            //primero encontrar con el átomo "o" la posición en el bloque y en el array, y hacerle un splice ahí
            //
            var ato = AtomosSeleccionados[o];


            var bloqueSIni = Math.ceil( ato.id / NoPaso  ) - 1;   //bloque 0 va del atomo 1 al 20 
            var verPosBS = (ato.id - (bloqueSIni * NoPaso) - 1) * nVertices; //da la posicion exacta en el arreglo
            
            var vertexPosition = (ato.PositionBWire-1)*nVertices; //867 es el número de vértices por cada esfera de latitudes y longitudes 16
            var colorPosition  = (ato.PositionBWire-1)*nColor;
            var indexPosition = (ato.PositionBWire-1)*nIndices;

            //alert("AtomNum: "+ato.NumberAtom);
            if (ato.NameAtom=='H') 
            {
                //alert("H");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayH[z]   + ato.X -Cx); //estoy quitando y al mismo tiempo agregando, por lo que se queda
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayH[z+1] + ato.Y -Cy); //la misma longitud en cada operación
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayH[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayH[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayH[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayH[z+2] + ato.Z -Cz);                  

                    z=z+3;
                }

            }
            else if (ato.NameAtom=='C') 
            {
                //alert("C");
                //ingresar los nuevos vértices
                for (var z=0; z<867;)  
                {      
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);
                                            
                    z=z+3;
                }
               
                //alert("saleC"); 
            }
            else if (ato.NameAtom=='PB') 
            {
                //alert("PB");
                //ingresar los nuevos vértices
                for (var z=0; z<867;)  
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);
                   
                    z=z+3;
                }
                
            }
            else if (ato.NameAtom=='TI') 
            {
                //alert("TI");
                //ingresar los nuevos vértices
                for (var z=0; z<867;)  
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);
                  
                    z=z+3;
                }
               
            }
            else if (ato.NameAtom=='CA') 
            {
                //alert("CA");
                //ingresar los nuevos vértices
                for (var z=0; z<867;)  
                {      
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayC_PB_TI_CA[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayC_PB_TI_CA[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayC_PB_TI_CA[z+2] + ato.Z -Cz);

                    z=z+3;
                }
               
            }
            else if (ato.NameAtom=='N') 
            {
                //alert("N");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayN[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayN[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayN[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayN[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayN[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayN[z+2] + ato.Z -Cz);
                                            
                    z=z+3;
                }
               
            }
            else if (ato.NameAtom=='O') 
            {
                //alert("O");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayO[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayO[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayO[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayO[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayO[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayO[z+2] + ato.Z -Cz);

                    z=z+3;
                }
               
                //alert("ssss");  

            }
             else if (ato.NameAtom=='S') 
            {
                //alert("S");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayS[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayS[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayS[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayS[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayS[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayS[z+2] + ato.Z -Cz);
                                            
                    z=z+3;
                }
               
            }
            else if (ato.NameAtom=='P') 
            {
                //alert("P");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayP[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayP[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayP[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayP[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayP[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayP[z+2] + ato.Z -Cz);

                    z=z+3;
                }
               
            }
            else /////////// DEFAULT
            {
                //alert("entra aqui");
                //ingresar los nuevos vértices
                for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArrayDefault[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArrayDefault[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArrayDefault[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArrayDefault[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArrayDefault[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArrayDefault[z+2] + ato.Z -Cz);

                    z=z+3;
                }
               
                //alert("eyyyyyyyyyytra aqui");
            }
            ato.Representation="CPK";

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[ato.BloqueWire-1]);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirePositionData[ato.BloqueWire-1]), gl.DYNAMIC_DRAW);
            sphereWirePositionBuffer[ato.BloqueWire-1].itemSize = 3;
            sphereWirePositionBuffer[ato.BloqueWire-1].numItems = (wirePositionData[ato.BloqueWire-1].length / 3) * 1;

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloqueSIni]);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexPositionDataD[bloqueSIni]), gl.DYNAMIC_DRAW);
            sphereDifufusePositionBuffer[bloqueSIni].itemSize = 3;
            sphereDifufusePositionBuffer[bloqueSIni].numItems = (vertexPositionDataD[bloqueSIni].length / 3) * 1;

            //gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[bloques]);
            //gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(wirePositionData[bloques]));   

            //gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloques]);
            //gl.bufferSubData(gl.ARRAY_BUFFER,0,new Float32Array(vertexPositionDataD[bloques]));   
          
        }
    }
    else if (Repre=='SB') 
    {
        //alert(88);
        for(var o in AtomosSeleccionados) //son los objetos seleccionados 
        {
            //primero encontrar con el átomo "o" la posición en el bloque y en el array, y hacerle un splice ahí
            //
            var ato = AtomosSeleccionados[o];

  			var bloqueSIni = Math.ceil( ato.NumberAtom / NoPaso  ) - 1;   //bloque 0 va del atomo 1 al 20 
            var verPosBS = (ato.NumberAtom - (bloqueSIni * NoPaso) - 1) * nVertices; //da la posicion exacta en el arreglo
            
            var vertexPosition = (ato.PositionBWire-1)*nVertices; //867 es el número de vértices por cada esfera de latitudes y longitudes 16
            var colorPosition  = (ato.PositionBWire-1)*nColor;
            var indexPosition = (ato.PositionBWire-1)*nIndices;

             for (var z=0; z<867;) //vertices para esfera de 16 latitudes y longitudes
                {        
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z,    1,verArray[z]   + ato.X -Cx);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 1,1,verArray[z+1] + ato.Y -Cy);
                    wirePositionData[ato.BloqueWire-1].splice(vertexPosition + z + 2,1,verArray[z+2] + ato.Z -Cz);

                    /////////////////////////////////////////CAMBIAR TAMBIÉN LOS DE LOS DIFFUSOS ////////////////////////////
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z,    1,verArray[z]   + ato.X -Cx);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 1,1,verArray[z+1] + ato.Y -Cy);
                    vertexPositionDataD[bloqueSIni].splice(verPosBS + z + 2,1,verArray[z+2] + ato.Z -Cz);

                    z=z+3;
                }

                      
          
            ato.Representation="SB";

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereWirePositionBuffer[ato.BloqueWire-1]);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(wirePositionData[ato.BloqueWire-1]), gl.DYNAMIC_DRAW);
            sphereWirePositionBuffer[ato.BloqueWire-1].itemSize = 3;
            sphereWirePositionBuffer[ato.BloqueWire-1].numItems = (wirePositionData[ato.BloqueWire-1].length / 3) * 1;

            gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[bloqueSIni]);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexPositionDataD[bloqueSIni]), gl.DYNAMIC_DRAW);
            sphereDifufusePositionBuffer[bloqueSIni].itemSize = 3;
            sphereDifufusePositionBuffer[bloqueSIni].numItems = (vertexPositionDataD[bloqueSIni].length / 3) * 1;
        }

    }
    else if (Repre=='B') 
    {



    }
    else
    {

    }
}