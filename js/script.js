

								for (var i = 0; i < nChain; i++) 
                                {
                                    ChainIndexW[atom.BloqueWire - 1].splice(((atom.PositionBWire - 1) * nChain) + i, 1, ChainIndexW[NBW - 1][ChainIndexW[NBW - 1].length - nChain + i]);
                                }  


								ChainIndexW[NBW - 1].splice((atom.PositionBWire - 1) * nChain, nChain);

								ChainIndex[NBS - 1].splice((atom.PositionBSolid - 1) * nChain, nChain);

								ChainIndex[NBS - 1].splice(ChainIndex[NBS - 1].length - nChain, nChain);


								gl.bindBuffer(gl.ARRAY_BUFFER, ChainBufferW[NBW - 1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndexW[NBW - 1]), gl.DYNAMIC_DRAW);
                                ChainBufferW[NBW - 1].itemSize = 2;
                                ChainBufferW[NBW - 1].numItems = (ChainIndexW[NBW - 1].length / 2) * 1;

                                
                                gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[NBS - 1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[NBS - 1]), gl.DYNAMIC_DRAW);
                                ChainBuffer[NBS - 1].itemSize = 2;
                                ChainBuffer[NBS - 1].numItems = (ChainIndex[NBS - 1].length / 2) * 1;

                                gl.bindBuffer(gl.ARRAY_BUFFER, ChainBuffer[atom.BloqueSolid - 1]);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ChainIndex[atom.BloqueSolid - 1]), gl.DYNAMIC_DRAW);
                                ChainBuffer[atom.BloqueSolid - 1].itemSize = 2;
                                ChainBuffer[atom.BloqueSolid - 1].numItems = (ChainIndex[atom.BloqueSolid - 1].length / 2) * 1;



                                for (var i = 0; i < nColor;) 
                                {
	                                ColorTotal[NBS - 1].push(atom.ColorRGB[0]);
	                                ColorTotal[NBS - 1].push(atom.ColorRGB[1]);
	                                ColorTotal[NBS - 1].push(atom.ColorRGB[2]);
	                                ColorTotal[NBS - 1].push(atom.ColorRGB[3]);
	                                i = i + 4;

	                                ChainIndex[i].push(atom.idChain);
	                                ChainIndex[i].push(atom.idChain);
                            	}