var AtomArray=[];


function initBuffersSpheres(repre) 
{
                
    //AtomosSeleccionados=molecule.LstAtoms;
    
    var NoAtomos = molecule.LstAtoms.length;
    NoBloques = Math.ceil(NoAtomos/NoPaso);
    var Restantes = NoAtomos - ((NoBloques-1) * NoPaso);

    var RGB_Diffuse = [,,];  //para asignarle un único valor de color difuso a cada átomo para distinguirlo de los demás en la selección
    //la que no se toma sería [0][0][0]  entonces comenzaría con [1][0][0]  y terminaría en [255][255][254]
    var R=0;
    var G=0;
    var B=0;

    var Scala=0.003921568627451;

    var ultimo=0;

    indexData = [[]];
    var ColorTotalDiffuse = [[]];

    
    var apuntador = 0;


    if (NoBloques==1) 
    {

        //para limpiarlos
        vertexPositionData[0]=[];
        normalDataN[0]=[];
        vertexPositionDataD[0]=[];
        normalDataND[0]=[];
        ColorTotalDiffuse[0]=[];
        ColorTotal[0]=[];
        indexData[0]=[];

        ChainIndex[0]=[];

        LstBS[0]=new Array();
        for(var i=0; i<NoAtomos; i++)
        {
            //-----------------------------------------------------------------------------------------
            //Asignación del color difuso a cáda átomo
            R=R+1;
            if (R==255) 
            {
                R=0;
                G=G+1;
                if (G==255) 
                {
                    G=0;
                    B=B+1;
                }
            }
            molecule.LstAtoms[apuntador].ColorRGBDiffuse=[R*Scala,G*Scala,B*Scala];
            molecule.LstAtoms[apuntador].BloqueSolid=1;
            molecule.LstAtoms[apuntador].PositionBSolid=i+1;
            
            LstBS[0].push(molecule.LstAtoms[apuntador]);
            //-----------------------------------------------------------------------------------------
            //en esta parte se asigna el color al átom
            AsignaColor(molecule.LstAtoms[apuntador]);   


            for (var z=0; z<verArray.length;) 
            {                            
                vertexPositionData[0].push(verArray[z]   + molecule.LstAtoms[apuntador].X -Cx);
                vertexPositionData[0].push(verArray[z+1] + molecule.LstAtoms[apuntador].Y -Cy);
                vertexPositionData[0].push(verArray[z+2] + molecule.LstAtoms[apuntador].Z -Cz);
                           
                normalDataN[0].push(normalData[z]);
                normalDataN[0].push(normalData[z+1]);
                normalDataN[0].push(normalData[z+2]);

                ///////////////////////// COLORES DIFFUSOS /////////////////////////////////////////
                vertexPositionDataD[0].push(verArray[z]   + molecule.LstAtoms[apuntador].X -Cx);
                vertexPositionDataD[0].push(verArray[z+1] + molecule.LstAtoms[apuntador].Y -Cy);
                vertexPositionDataD[0].push(verArray[z+2] + molecule.LstAtoms[apuntador].Z -Cz);
                           
                normalDataND[0].push(normalData[z]);
                normalDataND[0].push(normalData[z+1]);
                normalDataND[0].push(normalData[z+2]);
                ////////////////////////////////////////////////////////////////////////////////////

                z=z+3;

                
                ColorTotal[0].push(molecule.LstAtoms[apuntador].ColorRGB[0]);
                ColorTotal[0].push(molecule.LstAtoms[apuntador].ColorRGB[1]);
                ColorTotal[0].push(molecule.LstAtoms[apuntador].ColorRGB[2]);
                ColorTotal[0].push(1);

                ColorTotalDiffuse[0].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[0]);
                ColorTotalDiffuse[0].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[1]);
                ColorTotalDiffuse[0].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[2]);
                ColorTotalDiffuse[0].push(1);

                ChainIndex[0].push(molecule.LstAtoms[apuntador].idChain);
                ChainIndex[0].push(molecule.LstAtoms[apuntador].idChain);


            }
            //ColorTotalDiffuse[0].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse);
            //ColorTotalDiffuse[0]=ColorTotalDiffuse[0].concat(Dif[i]);
            //ColorTotal[0].push(molecule.LstAtoms[apuntador].ColorRGB);
            //alert(ColorTotalDiffuse[0].length);

            for (var latNumber=0; latNumber < latitudeBands; latNumber++) 
            {
                for (var longNumber=0; longNumber < longitudeBands; longNumber++) 
                {
                    var first = (latNumber * (longitudeBands + 1)) + longNumber;
                    var second = first + longitudeBands + 1;
                    indexData[0].push(first + ultimo);
                    indexData[0].push(second + ultimo);
                    indexData[0].push(first + 1 + ultimo);

                    indexData[0].push(second + ultimo);
                    indexData[0].push(second + 1 + ultimo);
                    indexData[0].push(first + 1 + ultimo);

                    /////////////////////////////////// COLORES DIFFUSOS //////////////////////////////
                    indexDataD[0].push(first + ultimo);
                    indexDataD[0].push(second + ultimo);
                    indexDataD[0].push(first + 1 + ultimo);

                    indexDataD[0].push(second + ultimo);
                    indexDataD[0].push(second + 1 + ultimo);
                    indexDataD[0].push(first + 1 + ultimo);
                    ////////////////////////////////////////////////////////////////////////////////////

                }
            }
            ultimo = (indexData[0][indexData[0].length-2]) + 1;
            apuntador=apuntador+1;

                //-----------------------------------------------------------------------------------------------------
        }

        ///////////////////////////////////////// COLORES REALES ///////////////////////////////////////////////

        sphereVertexPositionBuffer[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[0]), gl.DYNAMIC_DRAW);
        sphereVertexPositionBuffer[0].itemSize = 3;
        sphereVertexPositionBuffer[0].numItems = (vertexPositionData[0].length / 3) * 1;
        //alert("vertices: "+ vertexPositionData[0].length);

        sphereVertexColorBuffer[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[0]), gl.DYNAMIC_DRAW);
        sphereVertexColorBuffer[0].itemSize = 4;
        sphereVertexColorBuffer[0].numItems = ColorTotal[0].length/4;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //alert("ColorTotal: "+ ColorTotal[0].length);

        ChainBuffer[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[0]), gl.DYNAMIC_DRAW);
        ChainBuffer[0].itemSize = 2;
        ChainBuffer[0].numItems = ChainIndex[0].length/2;

        sphereVertexIndexBuffer[0] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[0]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[0]), gl.DYNAMIC_DRAW);
        sphereVertexIndexBuffer[0].itemSize = 1;
        sphereVertexIndexBuffer[0].numItems = indexData[0].length;
        //alert("indices: "+indexData[0].length);

        sphereVertexNormalBuffer[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[0]), gl.DYNAMIC_DRAW);
        sphereVertexNormalBuffer[0].itemSize = 3;
        sphereVertexNormalBuffer[0].numItems = (normalDataN[0].length / 3) * 1;

        ////////////////////////////////////////// COLORES DIFFUSOS ///////////////////////////////////////////////

        sphereVertexColorBufferDiffuse[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBufferDiffuse[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotalDiffuse[0]), gl.DYNAMIC_DRAW);
        sphereVertexColorBufferDiffuse[0].itemSize = 4;
        sphereVertexColorBufferDiffuse[0].numItems = ColorTotalDiffuse[0].length/4;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        //alert("ColorDiffuse: "+ColorTotalDiffuse[0].length);

        ChainBufferDif[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ChainBufferDif[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[0]), gl.DYNAMIC_DRAW);
        ChainBufferDif[0].itemSize = 2;
        ChainBufferDif[0].numItems = ChainIndex[0].length/2;

        sphereDifufusePositionBuffer[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataD[0]), gl.DYNAMIC_DRAW);
        sphereDifufusePositionBuffer[0].itemSize = 3;
        sphereDifufusePositionBuffer[0].numItems = (vertexPositionDataD[0].length / 3) * 1;

        sphereDiffuseIndexBuffer[0] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereDiffuseIndexBuffer[0]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexDataD[0]), gl.DYNAMIC_DRAW);
        sphereDiffuseIndexBuffer[0].itemSize = 1;
        sphereDiffuseIndexBuffer[0].numItems = indexDataD[0].length;

        sphereDiffuseNormalBuffer[0] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereDiffuseNormalBuffer[0]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataND[0]), gl.DYNAMIC_DRAW);
        sphereDiffuseNormalBuffer[0].itemSize = 3;
        sphereDiffuseNormalBuffer[0].numItems = (normalDataND[0].length / 3) * 1;

        //////////////////////////////////////////////////////////////////////////////////////////////////

    }
    else
    {
        for(var i=0; i<NoBloques; i++)
        {
                
            ultimo=0;
            vertexPositionData[i]=new Array();
            normalDataN[i]=new Array();
            ColorTotal[i]=new Array();  
            indexData[i]=new Array();
            ColorTotalDiffuse[i]=new Array();

            vertexPositionDataD[i]=new Array();
            normalDataND[i]=new Array();
            indexDataD[i]=new Array();
            LstBS[i]=new Array();

            ChainIndex[i]=new Array();

       
                /*
                sphereVertexPositionBuffer[i]=new Array();
                sphereVertexColorBuffer[i]=new Array();
                sphereVertexIndexBuffer[i]=new Array();
                sphereVertexNormalBuffer[i] =new Array();*/

            if (i==NoBloques-1) //esto es que llegó al último
            {
                for(var j=0; j<Restantes; j++)
                {

                    //-------------------------------------------------------------------------------------------------
                    //Asignación del color difuso a cáda átomo
                    R=R+1;
                    if (R==255) 
                    {
                        R=0;
                        G=G+1;
                        if (G==255) 
                        {
                            G=0;
                            B=B+1;
                        }
                    }
                    molecule.LstAtoms[apuntador].ColorRGBDiffuse= [R*Scala,G*Scala,B*Scala];

                    molecule.LstAtoms[apuntador].BloqueSolid=i+1;         
                    molecule.LstAtoms[apuntador].PositionBSolid=j+1;     //Preguntarle al doc si siempre aprecen en órden continuo
                    
                    LstBS[i].push(molecule.LstAtoms[apuntador]);
                    //-----------------------------------------------------------------------------------------

                    //en esta parte se asigna el color al átom
                    AsignaColor(molecule.LstAtoms[apuntador]);
                    for (var z=0; z<verArray.length;) 
                    {                            
                        vertexPositionData[i].push(verArray[z]   + molecule.LstAtoms[apuntador].X -Cx);
                        vertexPositionData[i].push(verArray[z+1] + molecule.LstAtoms[apuntador].Y -Cy);
                        vertexPositionData[i].push(verArray[z+2] + molecule.LstAtoms[apuntador].Z -Cz);
                          
                        normalDataN[i].push(normalData[z]);
                        normalDataN[i].push(normalData[z+1]);
                        normalDataN[i].push(normalData[z+2]);

                        ///////////////////////// COLORES DIFFUSOS /////////////////////////////////////////
                        vertexPositionDataD[i].push(verArray[z]   + molecule.LstAtoms[apuntador].X -Cx);
                        vertexPositionDataD[i].push(verArray[z+1] + molecule.LstAtoms[apuntador].Y -Cy);
                        vertexPositionDataD[i].push(verArray[z+2] + molecule.LstAtoms[apuntador].Z -Cz);
                                   
                        normalDataND[i].push(normalData[z]     );
                        normalDataND[i].push(normalData[z+1]   );
                        normalDataND[i].push(normalData[z+2]   );
                        ////////////////////////////////////////////////////////////////////////////////////

                        z=z+3;

                        ColorTotal[i].push(molecule.LstAtoms[apuntador].ColorRGB[0]);
                        ColorTotal[i].push(molecule.LstAtoms[apuntador].ColorRGB[1]);
                        ColorTotal[i].push(molecule.LstAtoms[apuntador].ColorRGB[2]);
                        ColorTotal[i].push(1);

                        ColorTotalDiffuse[i].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[0]);
                        ColorTotalDiffuse[i].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[1]);
                        ColorTotalDiffuse[i].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[2]);
                        ColorTotalDiffuse[i].push(1);

                        ChainIndex[i].push(molecule.LstAtoms[apuntador].idChain);
                        ChainIndex[i].push(molecule.LstAtoms[apuntador].idChain);

                        //ColorDiffuse=ColorDiffuse.concat(molecule.LstAtoms[apuntador].ColorRGBDiffuse);
                    }
                    //alert("vertices: " + vertexPositionData[i].length);
                    //ColorTotalDiffuse[i]=ColorTotalDiffuse[i].concat(molecule.LstAtoms[apuntador].ColorRGBDiffuse);
                    //ColorTotal[i]=ColorTotal[i].concat(molecule.LstAtoms[apuntador].ColorRGB);

                    for (var latNumber=0; latNumber < latitudeBands; latNumber++) 
                    {
                        for (var longNumber=0; longNumber < longitudeBands; longNumber++) 
                        {
                            var first = (latNumber * (longitudeBands + 1)) + longNumber;
                            var second = first + longitudeBands + 1;
                            indexData[i].push(first + ultimo);
                            indexData[i].push(second + ultimo);
                            indexData[i].push(first + 1 + ultimo);

                            indexData[i].push(second + ultimo);
                            indexData[i].push(second + 1 + ultimo);
                            indexData[i].push(first + 1 + ultimo);

                            /////////////////////////////////// COLORES DIFFUSOS //////////////////////////////
                            indexDataD[i].push(first + ultimo);
                            indexDataD[i].push(second + ultimo);
                            indexDataD[i].push(first + 1 + ultimo);

                            indexDataD[i].push(second + ultimo);
                            indexDataD[i].push(second + 1 + ultimo);
                            indexDataD[i].push(first + 1 + ultimo);
                            ////////////////////////////////////////////////////////////////////////////////////

                        }
                    }                   
                    ultimo = (indexData[i][indexData[i].length-2]) + 1;
                    apuntador=apuntador+1;

                    //---------------------------------------------------------------------------------------------------------
                }
                //alert(ColorTotalDiffuse[i].length);
                //alert(ColorTotal[i].length);


                //alert(vertexPositionData[i].length / 3);
                //alert(ColorTotal[i]);
                //alert(indexData[i]);


                sphereVertexPositionBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[i]), gl.DYNAMIC_DRAW);
                sphereVertexPositionBuffer[i].itemSize = 3;
                sphereVertexPositionBuffer[i].numItems = (vertexPositionData[i].length / 3) * 1;

                sphereVertexColorBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[i]), gl.DYNAMIC_DRAW);
                sphereVertexColorBuffer[i].itemSize = 4;
                sphereVertexColorBuffer[i].numItems = ColorTotal[i].length/4;

                ChainBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[i]), gl.DYNAMIC_DRAW);
                ChainBuffer[i].itemSize = 2;
                ChainBuffer[i].numItems = ChainIndex[i].length/2;

                sphereVertexIndexBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[i]);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[i]), gl.DYNAMIC_DRAW);
                sphereVertexIndexBuffer[i].itemSize = 1;
                sphereVertexIndexBuffer[i].numItems = indexData[i].length;

                sphereVertexNormalBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[i]), gl.DYNAMIC_DRAW);
                sphereVertexNormalBuffer[i].itemSize = 3;
                sphereVertexNormalBuffer[i].numItems = (normalDataN[i].length / 3) * 1;

                 ///////////////////////////////////////// COLORES DIFFUSOS ///////////////////////////////////////////////

                sphereVertexColorBufferDiffuse[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBufferDiffuse[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotalDiffuse[i]), gl.DYNAMIC_DRAW);
                sphereVertexColorBufferDiffuse[i].itemSize = 4;
                sphereVertexColorBufferDiffuse[i].numItems = ColorTotalDiffuse[i].length/4;
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                //alert("ColorDiffuse: "+ColorTotalDiffuse[0].length);

                ChainBufferDif[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, ChainBufferDif[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[i]), gl.DYNAMIC_DRAW);
                ChainBufferDif[i].itemSize = 2;
                ChainBufferDif[i].numItems = ChainIndex[i].length/2;

                sphereDifufusePositionBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataD[i]), gl.DYNAMIC_DRAW);
                sphereDifufusePositionBuffer[i].itemSize = 3;
                sphereDifufusePositionBuffer[i].numItems = (vertexPositionDataD[i].length / 3) * 1;

                sphereDiffuseIndexBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereDiffuseIndexBuffer[i]);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexDataD[i]), gl.DYNAMIC_DRAW);
                sphereDiffuseIndexBuffer[i].itemSize = 1;
                sphereDiffuseIndexBuffer[i].numItems = indexDataD[i].length;

                sphereDiffuseNormalBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereDiffuseNormalBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataND[i]), gl.DYNAMIC_DRAW);
                sphereDiffuseNormalBuffer[i].itemSize = 3;
                sphereDiffuseNormalBuffer[i].numItems = (normalDataND[i].length / 3) * 1;

                //////////////////////////////////////////////////////////////////////////////////////////////////
            }
            else
            {
                for (var j=0; j <NoPaso; j++) 
                {

                    //-----------------------------------------------------------------------------------------------------------

                    //Asignación del color difuso a cáda átomo
                    R=R+1;
                    if (R==255) 
                    {
                        R=0;
                        G=G+1;
                        if (G==255) 
                        {
                            G=0;
                            B=B+1;
                        }
                    }

                    molecule.LstAtoms[apuntador].ColorRGBDiffuse=[R*Scala,G*Scala,B*Scala];
                    molecule.LstAtoms[apuntador].BloqueSolid=i+1;         
                    molecule.LstAtoms[apuntador].PositionBSolid=j+1;     //Preguntarle al doc si siempre aprecen en órden continuo
                    
                    LstBS[i].push(molecule.LstAtoms[apuntador]);
                    //-----------------------------------------------------------------------------------------

                    //en esta parte se asigna el color al átom
                    AsignaColor(molecule.LstAtoms[apuntador]);
                    for (var z=0; z<verArray.length;) 
                    {
                        vertexPositionData[i].push(verArray[z]   + molecule.LstAtoms[apuntador].X -Cx);
                        vertexPositionData[i].push(verArray[z+1] + molecule.LstAtoms[apuntador].Y -Cy);
                        vertexPositionData[i].push(verArray[z+2] + molecule.LstAtoms[apuntador].Z -Cz);

                        normalDataN[i].push(normalData[z]);
                        normalDataN[i].push(normalData[z+1]);
                        normalDataN[i].push(normalData[z+2]);

                        ///////////////////////// COLORES DIFFUSOS /////////////////////////////////////////
                        vertexPositionDataD[i].push(verArray[z]   + molecule.LstAtoms[apuntador].X -Cx);
                        vertexPositionDataD[i].push(verArray[z+1] + molecule.LstAtoms[apuntador].Y -Cy);
                        vertexPositionDataD[i].push(verArray[z+2] + molecule.LstAtoms[apuntador].Z -Cz);
                                   
                        normalDataND[i].push(normalData[z]    );
                        normalDataND[i].push(normalData[z+1]  );
                        normalDataND[i].push(normalData[z+2]  );
                        ////////////////////////////////////////////////////////////////////////////////////


                        z=z+3;

                        ColorTotal[i].push(molecule.LstAtoms[apuntador].ColorRGB[0]);
                        ColorTotal[i].push(molecule.LstAtoms[apuntador].ColorRGB[1]);
                        ColorTotal[i].push(molecule.LstAtoms[apuntador].ColorRGB[2]);
                        ColorTotal[i].push(1);

                        ColorTotalDiffuse[i].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[0]);
                        ColorTotalDiffuse[i].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[1]);
                        ColorTotalDiffuse[i].push(molecule.LstAtoms[apuntador].ColorRGBDiffuse[2]);
                        ColorTotalDiffuse[i].push(1);

                        ChainIndex[i].push(molecule.LstAtoms[apuntador].idChain);
                        ChainIndex[i].push(molecule.LstAtoms[apuntador].idChain);

                        //ColorDiffuse=ColorDiffuse.concat(molecule.LstAtoms[apuntador].ColorRGBDiffuse);
                    }
                    //ColorTotalDiffuse[i]=ColorTotalDiffuse[i].concat(molecule.LstAtoms[apuntador].ColorRGBDiffuse); //estas son las líneas que se congelan
                    //ColorTotal[i]=ColorTotal[i].concat(molecule.LstAtoms[apuntador].ColorRGB); //estas son las líneas que se congelan

                    for (var latNumber=0; latNumber < latitudeBands; latNumber++) 
                    {
                        for (var longNumber=0; longNumber < longitudeBands; longNumber++) 
                        {
                            var first = (latNumber * (longitudeBands + 1)) + longNumber;
                            var second = first + longitudeBands + 1;
                            indexData[i].push(first + ultimo);
                            indexData[i].push(second + ultimo);
                            indexData[i].push(first + 1 + ultimo);

                            indexData[i].push(second + ultimo);
                            indexData[i].push(second + 1 + ultimo);
                            indexData[i].push(first + 1 + ultimo);

                            /////////////////////////////////// COLORES DIFFUSOS //////////////////////////////
                            indexDataD[i].push(first + ultimo);
                            indexDataD[i].push(second + ultimo);
                            indexDataD[i].push(first + 1 + ultimo);

                            indexDataD[i].push(second + ultimo);
                            indexDataD[i].push(second + 1 + ultimo);
                            indexDataD[i].push(first + 1 + ultimo);
                            ////////////////////////////////////////////////////////////////////////////////////
                        }
                    }
                    ultimo = (indexData[i][indexData[i].length-2]) + 1;
                    apuntador=apuntador+1;

                        //---------------------------------------------------------------------------------------------------
                }


                sphereVertexPositionBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData[i]), gl.DYNAMIC_DRAW);
                sphereVertexPositionBuffer[i].itemSize = 3;
                sphereVertexPositionBuffer[i].numItems = (vertexPositionData[i].length / 3) * 1;

                sphereVertexColorBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotal[i]), gl.DYNAMIC_DRAW);
                sphereVertexColorBuffer[i].itemSize = 4;
                sphereVertexColorBuffer[i].numItems = ColorTotal[i].length/4;

                ChainBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[i]), gl.DYNAMIC_DRAW);
                ChainBuffer[i].itemSize = 2;
                ChainBuffer[i].numItems = ChainIndex[i].length/2;

                sphereVertexIndexBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer[i]);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData[i]), gl.DYNAMIC_DRAW);
                sphereVertexIndexBuffer[i].itemSize = 1;
                sphereVertexIndexBuffer[i].numItems = indexData[i].length;

                sphereVertexNormalBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataN[i]), gl.DYNAMIC_DRAW);
                sphereVertexNormalBuffer[i].itemSize = 3;
                sphereVertexNormalBuffer[i].numItems = (normalDataN[i].length / 3) * 1;

                 ///////////////////////////////////////// COLORES DIFFUSOS ///////////////////////////////////////////////

                sphereVertexColorBufferDiffuse[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBufferDiffuse[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ColorTotalDiffuse[i]), gl.DYNAMIC_DRAW);
                sphereVertexColorBufferDiffuse[i].itemSize = 4;
                sphereVertexColorBufferDiffuse[i].numItems = ColorTotalDiffuse[i].length/4;
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                //alert("ColorDiffuse: "+ColorTotalDiffuse[0].length);

                ChainBufferDif[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, ChainBufferDif[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[i]), gl.DYNAMIC_DRAW);
                ChainBufferDif[i].itemSize = 2;
                ChainBufferDif[i].numItems = ChainIndex[i].length/2;

                sphereDifufusePositionBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereDifufusePositionBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionDataD[i]), gl.DYNAMIC_DRAW);
                sphereDifufusePositionBuffer[i].itemSize = 3;
                sphereDifufusePositionBuffer[i].numItems = (vertexPositionDataD[i].length / 3) * 1;

                sphereDiffuseIndexBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereDiffuseIndexBuffer[i]);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexDataD[i]), gl.DYNAMIC_DRAW);
                sphereDiffuseIndexBuffer[i].itemSize = 1;
                sphereDiffuseIndexBuffer[i].numItems = indexDataD[i].length;

                sphereDiffuseNormalBuffer[i] = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereDiffuseNormalBuffer[i]);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalDataND[i]), gl.DYNAMIC_DRAW);
                sphereDiffuseNormalBuffer[i].itemSize = 3;
                sphereDiffuseNormalBuffer[i].numItems = (normalDataND[i].length / 3) * 1;

                //////////////////////////////////////////////////////////////////////////////////////////////////

            }
        }
    }

    NBS=NoBloques;
        

}

function initBuffersBonds() 
{
    ///////////////////////////////////////////////////////// LINEAS DE ENLACES //////////////////////////////////////////////
    verticesLineas=[];
    ChainIndexB=[];
    lineVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
    var linesNormals=[];
    colores=[];
    for(var t in molecule.LstBonds)
    {
        var o = molecule.LstBonds[t];
        verticesLineas.push(o.LstAtoms[0].X -Cx);
        verticesLineas.push(o.LstAtoms[0].Y -Cy);
        verticesLineas.push(o.LstAtoms[0].Z -Cz);
        verticesLineas.push(o.LstAtoms[1].X -Cx);
        verticesLineas.push(o.LstAtoms[1].Y -Cy);
        verticesLineas.push(o.LstAtoms[1].Z -Cz);  
        linesNormals.push(o.LstAtoms[0].X -Cx);
        linesNormals.push(o.LstAtoms[0].Y -Cy);
        linesNormals.push(o.LstAtoms[0].Z -Cz);
        linesNormals.push(o.LstAtoms[1].X -Cx);
        linesNormals.push(o.LstAtoms[1].Y -Cy);
        linesNormals.push(o.LstAtoms[1].Z -Cz); 
        colores.push(1);
        colores.push(1);
        colores.push(1);
        colores.push(1);
        colores.push(1);
        colores.push(1);
        colores.push(1);
        colores.push(1);
        /////////////////////////
        if ( o.LstAtoms[0].idChain ==  o.LstAtoms[1].idChain  ) 
        {
            ChainIndexB.push( o.LstAtoms[0].idChain );
            ChainIndexB.push( o.LstAtoms[0].idChain );
            ChainIndexB.push( o.LstAtoms[0].idChain );
            ChainIndexB.push( o.LstAtoms[0].idChain );
        }
        else
        {
            ChainIndexB.push( 0.5 );
            ChainIndexB.push( 0.5 );
            ChainIndexB.push( 0.5 );
            ChainIndexB.push( 0.5 );
        }

    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesLineas), gl.DYNAMIC_DRAW);
    lineVertexPositionBuffer.itemSize = 3;
    lineVertexPositionBuffer.numItems = verticesLineas.length/3;
    
    colorVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorVertexBuffer);      

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colores), gl.DYNAMIC_DRAW);
    colorVertexBuffer.itemSize=4;
    colorVertexBuffer.numItems=colores.length/4;

    lineNormalBuffer = gl.createBuffer(); 
    gl.bindBuffer(gl.ARRAY_BUFFER, lineNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linesNormals), gl.DYNAMIC_DRAW);
    lineNormalBuffer.itemSize=3;
    lineNormalBuffer.numItems=linesNormals.length/3;

    ChainBufferB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ChainBufferB); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndexB), gl.DYNAMIC_DRAW);
    ChainBufferB.itemSize=2;
    ChainBufferB.numItems=ChainIndexB.length/2;   
 

}

