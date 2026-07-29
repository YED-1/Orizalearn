import enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from core.database import Base


class TipoModulo(str, enum.Enum):
    TEORIA = "teoria"     # Solo texto/video/recurso_url
    PRACTICA = "practica" # Requiere el Sandbox de Python
    EXAMEN = "examen"     # Examen de opción múltiple

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
    curso_id = Column(Integer, ForeignKey("cursos.id"), nullable=False) 
    titulo = Column(String(100), nullable=False)
    orden = Column(Integer, nullable=False)
    contenido_texto = Column(Text, nullable=False) 
    recurso_url = Column(String(255), nullable=True)     
    # tipo de módulo para que el frontend (React/Vue) sepa qué renderizar
    tipo_modulo = Column(Enum(TipoModulo), default=TipoModulo.TEORIA) 
    curso = relationship("Course", back_populates="modulos")
    # se asegura que si se borra un módulo, se borren sus ejercicios o preguntas
    ejercicios = relationship("Ejercicio", back_populates="modulo", cascade="all, delete-orphan")
    preguntas = relationship("Pregunta", back_populates="modulo", cascade="all, delete-orphan")

class Ejercicio(Base):
    __tablename__ = "ejercicios"

    id = Column(Integer, primary_key=True, index=True)
    modulo_id = Column(Integer, ForeignKey("modulos.id"), nullable=False)
    instrucciones = Column(Text, nullable=False)
    codigo_inicial = Column(Text, nullable=False) 
    solucion_esperada = Column(Text, nullable=False)
    casos_prueba = Column(Text) 
    
    modulo = relationship("Module", back_populates="ejercicios")

# Tablas nuevas para soportar Exámenes de Opción Múltiple 

class Pregunta(Base):
    __tablename__ = "preguntas"

    id = Column(Integer, primary_key=True, index=True)
    modulo_id = Column(Integer, ForeignKey("modulos.id"), nullable=False)
    texto = Column(Text, nullable=False)
    modulo = relationship("Module", back_populates="preguntas")
    # Una pregunta tiene muchas opciones
    opciones = relationship("Opcion", back_populates="pregunta", cascade="all, delete-orphan")

class Opcion(Base):
    __tablename__ = "opciones"

    id = Column(Integer, primary_key=True, index=True)
    pregunta_id = Column(Integer, ForeignKey("preguntas.id"), nullable=False)
    texto = Column(String(255), nullable=False)
    es_correcta = Column(Boolean, default=False) # Bandera para calificar automáticamente

    pregunta = relationship("Pregunta", back_populates="opciones")