from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class Course(Base):
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=False)
    imagen = Column(String(255), nullable=False)
    examen = Column(String(255), nullable=False)
    modulos = relationship("Module", back_populates="curso", cascade="all, delete-orphan")

class Module(Base):
    __tablename__ = "modulos"

    id = Column(Integer, primary_key=True, index=True)
    curso_id = Column(Integer, ForeignKey("cursos.id"), nullable=False) # La conexión al curso
    titulo = Column(String(100), nullable=False)
    orden = Column(Integer, nullable=False)
    contenido_texto = Column(Text, nullable=False) # La lectura o instrucciones
    recurso_url = Column(String(255), nullable=True) 
    # Relación inversa: Este módulo pertenece a un curso
    curso = relationship("Course", back_populates="modulos")
    ejercicios = relationship("Ejercicio", back_populates="modulo")

class Ejercicio(Base):
    __tablename__ = "ejercicios"

    id = Column(Integer, primary_key=True, index=True)
    modulo_id = Column(Integer, ForeignKey("modulos.id"), nullable=False)
    instrucciones = Column(Text, nullable=False)
    codigo_inicial = Column(Text, nullable=False) 
    solucion_esperada = Column(Text, nullable=False)
    casos_prueba = Column(Text) 
    modulo = relationship("Module", back_populates="ejercicios")